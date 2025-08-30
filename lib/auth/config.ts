import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db/client';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';

// Types étendus pour NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      active: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    active: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    active: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Authentification par email/mot de passe
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          });

          if (!user || !user.passwordHash) {
            throw new Error('Utilisateur non trouvé');
          }

          if (!user.active) {
            throw new Error('Compte désactivé');
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
          }

          // Mettre à jour la dernière connexion
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            active: user.active,
          };
        } catch (error) {
          console.error('Erreur authentification:', error);
          throw error;
        }
      }
    }),

    // Authentification Google (optionnel)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Première connexion
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.active = user.active;
      }

      // Vérifier si l'utilisateur est toujours actif
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { active: true, role: true }
          });

          if (!dbUser || !dbUser.active) {
            return null; // Force la déconnexion
          }

          token.active = dbUser.active;
          token.role = dbUser.role;
        } catch (error) {
          console.error('Erreur vérification utilisateur:', error);
          return null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.active = token.active;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Authentification Google
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          // Seuls les utilisateurs existants peuvent se connecter via Google
          if (!existingUser) {
            console.log('Tentative de connexion Google refusée:', user.email);
            return false;
          }

          if (!existingUser.active) {
            console.log('Compte désactivé:', user.email);
            return false;
          }

          return true;
        } catch (error) {
          console.error('Erreur signIn Google:', error);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirection après connexion
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/admin`;
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`✅ Connexion: ${user.email} via ${account?.provider}`);
      
      // Log de l'événement
      try {
        await prisma.analyticsEvent.create({
          data: {
            name: 'user_signin',
            category: 'user_interaction',
            properties: {
              provider: account?.provider,
              isNewUser,
            },
            userId: user.id,
          }
        });
      } catch (error) {
        console.error('Erreur log signin:', error);
      }
    },

    async signOut({ token }) {
      console.log(`👋 Déconnexion: ${token?.email}`);
    },

    async createUser({ user }) {
      console.log(`👤 Nouvel utilisateur: ${user.email}`);
    }
  },

  debug: process.env.NODE_ENV === 'development',
};

// Utilitaires pour la gestion des utilisateurs
export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRole = 'ADMIN'
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);
  
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role,
      active: true,
    }
  });
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 12);
  
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });
}

export async function toggleUserStatus(
  userId: string,
  active: boolean
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { active }
  });
}

// Middleware pour vérifier les permissions
export function requireAuth(roles?: UserRole[]) {
  return async (req: any, res: any, next: any) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!session.user.active) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    if (roles && !roles.includes(session.user.role)) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    req.user = session.user;
    next();
  };
}

// Hook pour utiliser l'authentification côté client
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === 'ADMIN',
    isEditor: session?.user?.role === 'EDITOR',
  };
}


import { NextAuthOptions, type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { Role } from '@prisma/client';

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Utilisateur non trouvé');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      }
    }),

    // Authentification Google (optionnel)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
      // Ajouter les informations utilisateur au token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      // Si connexion via Google, créer/mettre à jour l'utilisateur
      if (account?.provider === 'google' && user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (existingUser) {
          token.role = existingUser.role;
          token.id = existingUser.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Ajouter les informations du token à la session
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // Autoriser la connexion par credentials
      if (account?.provider === 'credentials') {
        return true;
      }

      // Pour Google OAuth, vérifier si l'utilisateur existe
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          // Si l'utilisateur n'existe pas, le créer
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'USER', // Rôle par défaut
              }
            });
          }

          return true;
        } catch (error) {
          console.error('Erreur lors de la connexion Google:', error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Connexion: ${user.email} via ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`Déconnexion: ${session?.user?.email}`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

// Types pour TypeScript (alignés avec lib/auth/config.ts)
// On étend sans modifier les types natifs NextAuth
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: Role;
      active: boolean;
    };
  }

  interface User {
    id: string;
    role: Role;
    active: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    active: boolean;
  }
}


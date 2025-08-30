import { NextRequest, NextResponse } from 'next/server';
import { coinbaseCommerce } from '@/lib/crypto/coinbase-commerce';

export async function POST(request: NextRequest) {
  try {
    const { packageType, customerData } = await request.json();

    // Validate package type
    if (!['ESSENTIEL', 'PROFESSIONNEL', 'BOUTIQUE'].includes(packageType)) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    // Create Coinbase Commerce charge
    const charge = await coinbaseCommerce.createPackageCharge(
      packageType,
      customerData
    );

    return NextResponse.json({ 
      success: true, 
      charge 
    });

  } catch (error) {
    console.error('Coinbase Commerce API error:', error);
    return NextResponse.json(
      { error: 'Failed to create crypto payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chargeId = searchParams.get('chargeId');

    if (!chargeId) {
      return NextResponse.json(
        { error: 'Charge ID required' },
        { status: 400 }
      );
    }

    const charge = await coinbaseCommerce.getCharge(chargeId);

    return NextResponse.json({ 
      success: true, 
      charge 
    });

  } catch (error) {
    console.error('Error fetching charge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charge' },
      { status: 500 }
    );
  }
}


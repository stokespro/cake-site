import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const sampleRequestSchema = z.object({
  contact_name: z.string().min(2),
  dispensary_name: z.string().min(2),
  omma_license: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(10),
  strain_slugs: z.array(z.string()).min(1),
  notes: z.string().optional(),
});

type CustomerLookup = {
  id: string;
  business_name: string;
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = sampleRequestSchema.parse(body);

    // Step 1: Check if customer exists by OMMA license
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, business_name')
      .eq('omma_license', validatedData.omma_license)
      .maybeSingle<CustomerLookup>();

    let customer_id: string | null = null;
    let is_existing_customer = false;

    if (customerData && !customerError) {
      customer_id = customerData.id;
      is_existing_customer = true;
      console.log('Found existing customer:', customerData.business_name);
    } else {
      console.log('New lead - no existing customer found');
    }

    // Step 2: Insert sample request
    const insertData = {
      contact_name: validatedData.contact_name,
      dispensary_name: validatedData.dispensary_name,
      omma_license: validatedData.omma_license,
      email: validatedData.email,
      phone: validatedData.phone,
      strain_slugs: validatedData.strain_slugs,
      notes: validatedData.notes || null,
      customer_id: customer_id,
      is_existing_customer: is_existing_customer,
      status: 'new',
    };

    const insertResult = await supabaseAdmin
      .from('sample_requests')
      .insert(insertData as any)
      .select()
      .single();

    if (insertResult.error) {
      console.error('Error inserting sample request:', insertResult.error);
      return NextResponse.json(
        { error: 'Failed to save request' },
        { status: 500 }
      );
    }

    const sampleRequest = insertResult.data as any;

    // Step 3: TODO - Send notification email
    // This would integrate with Resend or similar
    // For now, we'll just log it
    console.log('Sample request created:', sampleRequest?.id);
    console.log('Notification should be sent to sales team');

    // Return success
    return NextResponse.json({
      success: true,
      request_id: sampleRequest?.id || 'unknown',
      is_existing_customer,
    });

  } catch (error: any) {
    console.error('Sample request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

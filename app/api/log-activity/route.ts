import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Simplified emission factors for demonstration. Use an API like Climatiq for production.
const emissionFactors: { [key: string]: { factor: number, description: string } } = {
  'driving_km': { factor: 0.25, description: 'Drove a gasoline car' }, // kg CO2e per km
  'beef_kg': { factor: 60.0, description: 'Ate beef' },       // kg CO2e per kg
  'plant_based_meal': { factor: 0.5, description: 'Ate a plant-based meal' }, // kg CO2e per meal
  'biking_km': { factor: -0.25, description: 'Biked instead of driving' }, // Negative emissions
};

export async function POST(request: Request) {
  const { activity_type, value } = await request.json();
  
  if (!activity_type || !value || !emissionFactors[activity_type]) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const co2_emissions = value * emissionFactors[activity_type].factor;
  const description = emissionFactors[activity_type].description;

  const { error: activityError } = await supabase.from('activities').insert({
    user_id: session.user.id,
    activity_type,
    description,
    value,
    co2_emissions,
  });

  if (activityError) {
    return NextResponse.json({ error: activityError.message }, { status: 500 });
  }

  // Update GreenCred Score
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('green_cred_score')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'Could not find user to update score.' }, { status: 500 });
  }

  // Simple scoring logic: emissions decrease score, offsets increase it.
  const scoreChange = -Math.round(co2_emissions); 
  const newScore = user.green_cred_score + scoreChange;

  await supabase
    .from('users')
    .update({ green_cred_score: newScore })
    .eq('id', session.user.id);


  // Revalidate the dashboard path to show new data immediately
  revalidatePath('/dashboard');

  return NextResponse.json({ message: 'Activity logged successfully' });
}

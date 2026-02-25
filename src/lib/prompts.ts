export const ORTHODONTIC_TRANSFORM_PROMPT = `Edit this photo to simulate realistic orthodontic treatment results on the person's teeth. This is a before/after dental transformation.

CRITICAL CHANGES TO MAKE TO THE TEETH:
- Straighten all crooked or misaligned teeth so they form a perfect, even arch
- Close any visible gaps between teeth completely
- Fix any crowding by spacing teeth evenly
- Make the teeth symmetrical left-to-right
- Align the midline of the upper and lower teeth
- Level the bite so all teeth are the same height along the smile line
- Make the teeth appear white, clean, and professionally treated

DO NOT CHANGE ANYTHING ELSE:
- Keep the exact same person, face, and identity
- Do not alter lips, mouth shape, face shape, or jaw
- Do not change skin color, texture, lighting, or background
- Do not change hair, eyes, nose, or any other facial feature
- Do not change clothing or anything outside the teeth area

The result should look like the same photo but after 18 months of professional orthodontic braces or Invisalign treatment. The teeth improvement should be clearly obvious and dramatic.`;

export const QUALITY_CHECK_PROMPT = `You are validating if a smile photo is usable for orthodontic simulation.
Return strict JSON only, with this shape:
{
  "ok": boolean,
  "code": "OK" | "NO_TEETH_VISIBLE" | "BLURRY_PHOTO" | "NOT_FRONT_FACING" | "POOR_LIGHTING",
  "message": string
}

Validation rules:
- Teeth must be clearly visible.
- Smile should be roughly front-facing.
- Image should be in focus enough to evaluate teeth.
- Lighting should be sufficient to see teeth detail.

If any required rule fails, set ok=false and choose the best failure code.`;

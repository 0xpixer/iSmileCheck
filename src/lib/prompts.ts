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

export const QUALITY_CHECK_PROMPT = `You are validating if a smile photo is usable for orthodontic simulation. Be lenient: only reject when the photo is clearly unusable. When in doubt, set ok=true.

Return strict JSON only, with this shape:
{
  "ok": boolean,
  "code": "OK" | "NO_TEETH_VISIBLE" | "BLURRY_PHOTO" | "NOT_FRONT_FACING" | "POOR_LIGHTING",
  "message": string
}

Only set ok=false in these cases:
- NO_TEETH_VISIBLE: No teeth visible at all (e.g. mouth closed, face turned away, or not a face photo).
- BLURRY_PHOTO: So blurry that teeth and face are unrecognisable (reject only extreme blur).
- NOT_FRONT_FACING: Face is in strong profile or from behind; slight angles are acceptable.
- POOR_LIGHTING: So dark that teeth and smile cannot be seen at all; dim or uneven lighting is acceptable.

Accept: moderate blur, soft focus, dim or indoor lighting, slight head tilt, teeth partly visible, casual selfies. Prefer accepting borderline photos.`;

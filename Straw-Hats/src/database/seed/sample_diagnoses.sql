INSERT INTO diagnoses
  (animal_type, symptoms_text, disease, confidence, severity, vet_required, zoonotic_risk, lat, lng)
VALUES
  ('cattle',  'Blisters on mouth and feet',        'Foot and Mouth Disease',    89, 'high',     true,  false, 27.7172,  85.3240),
  ('poultry', 'Sudden death, twisted neck',         'Newcastle Disease',         92, 'critical', true,  false, 27.4712,  89.6395),
  ('cattle',  'High fever, skin lesions',           'Foot and Mouth Disease',    78, 'high',     true,  false, 27.5030,  84.3542),
  ('goat',    'Mouth ulcers, nasal discharge',      'PPR',                       85, 'critical', true,  false, 23.8103,  90.4125),
  ('poultry', 'Respiratory distress, blue comb',    'Avian Influenza',           71, 'critical', true,  true,  23.7275,  90.4009),
  ('cattle',  'Not eating, excessive salivation',   'Foot and Mouth Disease',    81, 'high',     true,  false, 27.0000,  85.0000),
  ('pig',     'High fever, reddish skin patches',   'African Swine Fever',       76, 'critical', true,  false, -1.2921,  36.8219),
  ('cattle',  'Distended left abdomen, pain',       'Bloat',                     94, 'critical', false, false, 27.9000,  83.3000),
  ('goat',    'Crusty lesions on lips and nose',    'Contagious Ecthyma',        88, 'medium',   false, true,  28.2000,  83.9000),
  ('poultry', 'Reduced egg production, coughing',   'Newcastle Disease',         67, 'high',     true,  false, 23.8500,  90.3500),
  ('cattle',  'Coughing, nasal discharge, fever',   'Bovine Respiratory Disease',79, 'medium',   true,  false, 27.6000,  85.4000),
  ('cattle',  'Sores on hooves, severe limping',    'Foot and Mouth Disease',    91, 'high',     true,  false, -0.0236,  37.9062),
  ('goat',    'Fever, eye discharge, weakness',     'PPR',                       83, 'critical', true,  false, 24.0000,  90.5000),
  ('poultry', 'Green diarrhoea, sudden death',      'Newcastle Disease',         86, 'critical', true,  false, 27.8000,  85.1000),
  ('cattle',  'Weight loss, dull coat, lethargy',   'Trypanosomiasis',           72, 'medium',   true,  true,  -1.1000,  36.7000);

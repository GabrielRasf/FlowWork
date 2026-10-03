-- Conteúdo inicial. Cada treino só entra se o título ainda não existir.
-- Os exercícios só entram se essa ficha ainda não tiver nenhum.

INSERT INTO treinos (titulo, descricao)
SELECT 'Peito', 'Ficha de peito para academia, com barras, halteres e peso corporal. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Peito');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Peito', 'Supino reto', '4x8-10', 0),
  ('Peito', 'Supino inclinado', '4x8-10', 1),
  ('Peito', 'Supino declinado', '3x10', 2),
  ('Peito', 'Crucifixo', '3x12', 3),
  ('Peito', 'Crucifixo inclinado', '3x12', 4),
  ('Peito', 'Flexão de braço', '3x12', 5),
  ('Peito', 'Crossover no cabo', '3x15', 6),
  ('Peito', 'Mergulho em paralelas', '3x8-12', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Peito'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Costas', 'Ficha de costas com puxadas e remadas, para academia. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Costas');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Costas', 'Puxada frontal', '4x8-10', 0),
  ('Costas', 'Barra fixa', '3x6-10', 1),
  ('Costas', 'Remada', '4x8-10', 2),
  ('Costas', 'Remada curvada', '3x8-10', 3),
  ('Costas', 'Remada baixa', '3x10-12', 4),
  ('Costas', 'Remada unilateral', '3x10', 5),
  ('Costas', 'Pulldown', '3x12', 6),
  ('Costas', 'Encolhimento', '3x12', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Costas'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Ombros', 'Ficha de ombros com desenvolvimento e elevações. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Ombros');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Ombros', 'Desenvolvimento de ombros', '4x8-10', 0),
  ('Ombros', 'Desenvolvimento com halteres', '3x10', 1),
  ('Ombros', 'Elevação lateral', '4x12-15', 2),
  ('Ombros', 'Elevação frontal', '3x12', 3),
  ('Ombros', 'Face pull', '3x15', 4),
  ('Ombros', 'Remada alta', '3x12', 5)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Ombros'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Braços', 'Ficha de bíceps e tríceps para academia. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Braços');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Bíceps', 'Rosca direta', '4x8-12', 0),
  ('Bíceps', 'Rosca martelo', '3x10-12', 1),
  ('Bíceps', 'Rosca scott', '3x10', 2),
  ('Bíceps', 'Rosca concentrada', '3x12', 3),
  ('Tríceps', 'Tríceps pulley', '4x10-12', 4),
  ('Tríceps', 'Tríceps testa', '3x10', 5),
  ('Tríceps', 'Tríceps francês', '3x10-12', 6),
  ('Tríceps', 'Mergulho no banco', '3x12', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Braços'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Pernas', 'Ficha de pernas com quadríceps, posterior de coxa e panturrilhas. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Pernas');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Quadríceps', 'Agachamento livre', '4x6-10', 0),
  ('Quadríceps', 'Agachamento sumô', '3x10', 1),
  ('Quadríceps', 'Leg press', '4x10-12', 2),
  ('Quadríceps', 'Afundo', '3x10', 3),
  ('Quadríceps', 'Cadeira extensora', '3x12-15', 4),
  ('Posterior', 'Mesa flexora', '4x10-12', 5),
  ('Posterior', 'Stiff', '4x8-10', 6),
  ('Posterior', 'Cadeira flexora', '3x12', 7),
  ('Panturrilhas', 'Panturrilha em pé', '4x12-15', 8),
  ('Panturrilhas', 'Panturrilha sentado', '3x15', 9)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Pernas'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Glúteos', 'Ficha de glúteos com elevação pélvica, agachamento e stiff. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Glúteos');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Glúteos', 'Elevação pélvica', '4x8-12', 0),
  ('Glúteos', 'Hip thrust', '4x8-10', 1),
  ('Glúteos', 'Agachamento sumô', '3x12', 2),
  ('Glúteos', 'Afundo', '3x10', 3),
  ('Glúteos', 'Stiff', '3x10', 4),
  ('Glúteos', 'Abdução de quadril', '3x15', 5),
  ('Glúteos', 'Ponte de glúteo', '3x15', 6)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Glúteos'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Abdômen', 'Ficha de abdômen com prancha, abdominais e mountain climber. Pode ser feita em casa.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Abdômen');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Abdômen', 'Prancha', '3x40s', 0),
  ('Abdômen', 'Prancha lateral', '3x30s', 1),
  ('Abdômen', 'Abdominal', '3x15', 2),
  ('Abdômen', 'Abdominal infra', '3x12', 3),
  ('Abdômen', 'Abdominal oblíquo', '3x12', 4),
  ('Abdômen', 'Mountain climber', '3x20', 5),
  ('Abdômen', 'Elevação de pernas', '3x12', 6)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Abdômen'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Full body', 'Ficha de corpo inteiro em quatro blocos, para quem treina poucos dias na semana. Nível intermediário.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Full body');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Peito', 'Supino inclinado', '3x10', 0),
  ('Peito', 'Flexão de braço', '3x12', 1),
  ('Costas', 'Barra fixa', '3x6-10', 2),
  ('Costas', 'Remada unilateral', '3x10', 3),
  ('Pernas', 'Agachamento sumô', '3x12', 4),
  ('Pernas', 'Panturrilha em pé', '3x15', 5),
  ('Abdômen', 'Prancha', '3x40s', 6),
  ('Abdômen', 'Abdominal', '3x15', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Full body'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Iniciantes', 'Ficha de corpo inteiro para quem está começando, com movimentos simples e pouca complexidade.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Iniciantes');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Corpo inteiro', 'Agachamento livre', '3x10', 0),
  ('Corpo inteiro', 'Flexão de braço', '3x8', 1),
  ('Corpo inteiro', 'Remada', '3x10', 2),
  ('Corpo inteiro', 'Elevação pélvica', '3x12', 3),
  ('Corpo inteiro', 'Desenvolvimento de ombros', '3x10', 4),
  ('Corpo inteiro', 'Prancha', '3x20s', 5),
  ('Corpo inteiro', 'Abdominal', '3x10', 6),
  ('Corpo inteiro', 'Panturrilha em pé', '3x12', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Iniciantes'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Intermediário', 'Ficha de corpo inteiro para quem já treina com regularidade e controla a execução.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Intermediário');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Corpo inteiro', 'Supino reto', '4x8', 0),
  ('Corpo inteiro', 'Puxada frontal', '4x10', 1),
  ('Corpo inteiro', 'Desenvolvimento de ombros', '3x10', 2),
  ('Corpo inteiro', 'Agachamento livre', '4x8', 3),
  ('Corpo inteiro', 'Mesa flexora', '3x12', 4),
  ('Corpo inteiro', 'Rosca direta', '3x10', 5),
  ('Corpo inteiro', 'Tríceps pulley', '3x12', 6),
  ('Corpo inteiro', 'Prancha', '3x40s', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Intermediário'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Avançado', 'Ficha de força com séries mais pesadas e menos repetições. Exige experiência com os movimentos.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Avançado');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Força', 'Agachamento livre', '5x5', 0),
  ('Força', 'Supino reto', '5x5', 1),
  ('Força', 'Barra fixa', '4x6-8', 2),
  ('Força', 'Desenvolvimento de ombros', '4x6', 3),
  ('Força', 'Stiff', '4x6', 4),
  ('Força', 'Leg press', '4x8', 5),
  ('Força', 'Afundo', '3x8', 6),
  ('Força', 'Prancha', '3x60s', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Avançado'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Peso corporal', 'Ficha sem aparelhos, usando apenas o peso do corpo. Serve para casa ou parque.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Peso corporal');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Peso corporal', 'Flexão de braço', '4x12', 0),
  ('Peso corporal', 'Barra fixa', '4x6-10', 1),
  ('Peso corporal', 'Agachamento livre', '4x15', 2),
  ('Peso corporal', 'Afundo', '3x10', 3),
  ('Peso corporal', 'Elevação pélvica', '3x15', 4),
  ('Peso corporal', 'Prancha', '3x40s', 5),
  ('Peso corporal', 'Mountain climber', '3x20', 6),
  ('Peso corporal', 'Burpee', '3x10', 7),
  ('Peso corporal', 'Abdominal', '3x15', 8)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Peso corporal'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Academia', 'Ficha geral de academia, com máquinas e pesos livres, cobrindo o corpo inteiro.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Academia');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Academia', 'Leg press', '4x10', 0),
  ('Academia', 'Cadeira extensora', '3x12', 1),
  ('Academia', 'Mesa flexora', '3x12', 2),
  ('Academia', 'Supino reto', '4x8', 3),
  ('Academia', 'Puxada frontal', '4x10', 4),
  ('Academia', 'Desenvolvimento de ombros', '3x10', 5),
  ('Academia', 'Rosca martelo', '3x12', 6),
  ('Academia', 'Tríceps pulley', '3x12', 7),
  ('Academia', 'Panturrilha em pé', '4x15', 8)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Academia'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Rápido, 25 minutos', 'Circuito curto, em torno de 25 minutos, com pouco descanso entre os exercícios.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Rápido, 25 minutos');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Circuito', 'Polichinelo', '3x30s', 0),
  ('Circuito', 'Agachamento livre', '3x12', 1),
  ('Circuito', 'Flexão de braço', '3x10', 2),
  ('Circuito', 'Remada', '3x10', 3),
  ('Circuito', 'Mountain climber', '3x20', 4),
  ('Circuito', 'Burpee', '3x8', 5),
  ('Circuito', 'Prancha', '3x30s', 6),
  ('Circuito', 'Abdominal', '3x15', 7)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Rápido, 25 minutos'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

INSERT INTO treinos (titulo, descricao)
SELECT 'Cardio', 'Bloco de cardio intervalado, em torno de 20 a 25 minutos, sem aparelho obrigatório.'
WHERE NOT EXISTS (SELECT 1 FROM treinos WHERE titulo = 'Cardio');

INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
SELECT t.id, v.bloco, v.nome, v.series_repeticoes, v.ordem
FROM treinos t
CROSS JOIN (VALUES
  ('Cardio', 'Polichinelo', '4x40s', 0),
  ('Cardio', 'Burpee', '4x10', 1),
  ('Cardio', 'Mountain climber', '4x30s', 2),
  ('Cardio', 'Corrida estacionária', '4x40s', 3),
  ('Cardio', 'Agachamento com salto', '3x12', 4),
  ('Cardio', 'Prancha', '3x30s', 5)
) AS v(bloco, nome, series_repeticoes, ordem)
WHERE t.titulo = 'Cardio'
  AND NOT EXISTS (SELECT 1 FROM exercicios e WHERE e.treino_id = t.id);

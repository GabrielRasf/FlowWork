CREATE TABLE usuarios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome TEXT,
  nome_usuario TEXT,
  email TEXT UNIQUE,
  telefone TEXT,
  genero TEXT,
  estado TEXT,
  cidade TEXT,
  data_nascimento DATE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE treinos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo TEXT NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 200),
  descricao TEXT NOT NULL DEFAULT '' CHECK (char_length(descricao) <= 2000),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exercicios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  treino_id INTEGER NOT NULL REFERENCES treinos (id) ON DELETE CASCADE,
  bloco TEXT NOT NULL CHECK (char_length(bloco) BETWEEN 1 AND 80),
  nome TEXT NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 100),
  series_repeticoes TEXT NOT NULL CHECK (char_length(series_repeticoes) BETWEEN 1 AND 50),
  ordem INTEGER NOT NULL DEFAULT 0 CHECK (ordem >= 0)
);

CREATE INDEX exercicios_treino_id_idx ON exercicios (treino_id, ordem);

CREATE TABLE comentarios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  treino_id INTEGER NOT NULL REFERENCES treinos (id) ON DELETE CASCADE,
  autor TEXT NOT NULL DEFAULT 'Visitante' CHECK (char_length(autor) BETWEEN 1 AND 80),
  texto TEXT NOT NULL CHECK (char_length(texto) BETWEEN 1 AND 500),
  token_hash TEXT NOT NULL CHECK (char_length(token_hash) = 64),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX comentarios_treino_id_idx ON comentarios (treino_id, criado_em);

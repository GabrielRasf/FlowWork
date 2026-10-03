# Flow Work

Catálogo de treinos. A interface fica em `frontend/pages/index.html`.

```text
frontend/     páginas, CSS, JavaScript e imagens
prototypes/   versões antigas de teste, fora do fluxo oficial
api/          funções da API
database/     SQL e script de migration
legacy/       projetos ASP.NET antigos, fora do deploy
```

A conexão com o banco usa somente a variável `DATABASE_URL`, fora dos arquivos versionados. O arquivo de exemplo é `.env.example`.

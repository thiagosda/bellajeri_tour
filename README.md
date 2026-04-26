# Bella Jeri Tour

Projeto estático em HTML, CSS e JavaScript.

## Estrutura do projeto

```txt
bella-jeri-tour/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── assets/
    └── images/
```

## Como abrir no computador

Abra o arquivo `index.html` no navegador.

Se quiser testar de forma mais correta, use a extensão **Live Server** no VS Code.

## Como subir para o GitHub pelo terminal

1. Crie um repositório novo no GitHub.
2. Não marque a opção de criar README, porque este projeto já possui um.
3. Copie a URL do repositório.
4. Dentro da pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Primeira versão do site Bella Jeri Tour"
git branch -M main
git remote add origin COLE_A_URL_DO_SEU_REPOSITORIO_AQUI
git push -u origin main
```

Exemplo da URL:

```bash
git remote add origin https://github.com/seu-usuario/bella-jeri-tour.git
```

## Como subir para o GitHub pelo site

1. Entre no GitHub.
2. Clique em **New repository**.
3. Coloque o nome do repositório, por exemplo: `bella-jeri-tour`.
4. Crie o repositório.
5. Clique em **uploading an existing file**.
6. Arraste todos os arquivos e pastas deste projeto.
7. Clique em **Commit changes**.

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings**.
2. Entre em **Pages**.
3. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Clique em **Save**.
5. O GitHub vai gerar um link público do site.

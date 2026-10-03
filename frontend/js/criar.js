import { criarTreino } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
    const publishButton = document.getElementById('publish-button');
    const workoutDescription = document.getElementById('workout-description');
    const imageUploaderArea = document.getElementById('image-uploader-area');
    const imageInput = document.getElementById('image-input');
    const uploaderText = document.getElementById('uploader-text');
    let uploadedFile = null;
    let currentImageURL = null;
    let enviando = false; 

    // --- FUNÇÃO PARA TORNAR TÍTULOS EDITÁVEIS ---
    function makeEditableOnClick(container, titleElement, defaultText, isMainTitle = false) {
        container.addEventListener('click', function() {
            const currentTitle = titleElement.textContent.trim();
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentTitle;
            
            inputField.style.cssText = `
                width: auto;
                font-size: ${isMainTitle ? '2.5rem' : '1.5rem'};
                text-align: center;
                font-weight: bold;
                border: none;
                background-color: var(--cor-fundo-elemento);
                color: white;
                border-bottom: 2px solid var(--cor-roxo);
                outline: none;
            `;
            
            titleElement.style.display = 'none';
            container.querySelector('.edit-cue').style.display = 'none';
            container.insertBefore(inputField, titleElement);
            inputField.focus();
            
            const saveChanges = () => {
                titleElement.textContent = inputField.value.trim() || defaultText;
                inputField.remove();
                titleElement.style.display = 'inline';
                container.querySelector('.edit-cue').style.display = 'inline';
            };
            
            inputField.addEventListener('blur', saveChanges);
            inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') inputField.blur(); });
        });
    }
    
    makeEditableOnClick(document.getElementById('title-container'), document.getElementById('workout-title-display'), 'Nova Ficha de Treino', true);
    document.querySelectorAll('.workout-title-container').forEach(container => {
        makeEditableOnClick(container, container.querySelector('h3'), 'Nome do Treino');
    });

    // --- UPLOAD E REMOÇÃO DE IMAGEM ---
    function resetImageUploader() {
        imageUploaderArea.innerHTML = ''; 
        imageUploaderArea.appendChild(uploaderText);
        if (currentImageURL) {
            URL.revokeObjectURL(currentImageURL);
        }
        uploadedFile = null;
        currentImageURL = null;
        imageInput.value = '';
    }

    function displayImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem válido.');
            return;
        }
        uploadedFile = file;
        currentImageURL = URL.createObjectURL(file);
        
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.width = '100%';
        imgContainer.style.height = '100%';

        const imageElement = document.createElement('img');
        imageElement.src = currentImageURL;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remover imagem';

        removeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            resetImageUploader();
        });

        imgContainer.appendChild(imageElement);
        imgContainer.appendChild(removeBtn);
        imageUploaderArea.innerHTML = '';
        imageUploaderArea.appendChild(imgContainer);
    }

    imageInput.addEventListener('change', (e) => displayImage(e.target.files[0]));
    imageUploaderArea.addEventListener('click', () => imageInput.click());
    imageUploaderArea.addEventListener('dragover', (e) => { e.preventDefault(); imageUploaderArea.classList.add('dragover'); });
    imageUploaderArea.addEventListener('dragleave', () => imageUploaderArea.classList.remove('dragover'));
    imageUploaderArea.addEventListener('drop', (e) => { e.preventDefault(); imageUploaderArea.classList.remove('dragover'); displayImage(e.dataTransfer.files[0]); });

    // --- ADIÇÃO E EDIÇÃO DE EXERCÍCIOS ---
    function createExerciseDisplay(name, reps) {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.innerHTML = `
            <span class="exercise-name-display">${name}</span>
            <div class="actions">
                <span class="exercise-reps-display">${reps}</span>
                <button class="edit-exercise-btn" title="Editar Exercício"><i class="fa-solid fa-pen"></i></button>
                <button class="remove-exercise-btn" title="Remover Exercício"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        exerciseItem.querySelector('.remove-exercise-btn').addEventListener('click', () => exerciseItem.remove());
        exerciseItem.querySelector('.edit-exercise-btn').addEventListener('click', () => {
            const inputRow = createExerciseInputRow(name, reps);
            exerciseItem.replaceWith(inputRow);
            inputRow.querySelector('.exercise-name-input').focus();
        });
        return exerciseItem;
    }

    function createExerciseInputRow(initialName = '', initialReps = '') {
        const inputItem = document.createElement('div');
        inputItem.className = 'exercise-input-item';
        inputItem.innerHTML = `
            <input type="text" placeholder="Nome do Exercício" class="exercise-name-input" value="${initialName}">
            <input type="text" placeholder="Séries x Reps" class="exercise-reps-input" value="${initialReps}">
            <div class="actions">
                <button class="save-exercise-btn" title="Salvar"><i class="fa-solid fa-check"></i></button>
                <button class="cancel-exercise-btn" title="Cancelar"><i class="fa-solid fa-times"></i></button>
            </div>
        `;
        const save = () => {
            const name = inputItem.querySelector('.exercise-name-input').value.trim();
            const reps = inputItem.querySelector('.exercise-reps-input').value.trim();
            if (name && reps) {
                inputItem.replaceWith(createExerciseDisplay(name, reps));
            } else {
                alert('Preencha o nome e as séries/repetições.');
            }
        };
        inputItem.querySelector('.save-exercise-btn').addEventListener('click', save);
        inputItem.querySelector('.exercise-reps-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); });
        inputItem.querySelector('.cancel-exercise-btn').addEventListener('click', () => {
            if (initialName) {
                inputItem.replaceWith(createExerciseDisplay(initialName, initialReps));
            } else {
                inputItem.remove();
            }
        });
        return inputItem;
    }

    document.querySelectorAll('.add-exercise-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetContainer = document.getElementById(this.dataset.target);
            if (targetContainer.querySelector('.exercise-input-item')) {
                targetContainer.querySelector('.exercise-name-input').focus();
                return;
            }
            const inputRow = createExerciseInputRow();
            targetContainer.appendChild(inputRow);
            inputRow.querySelector('.exercise-name-input').focus();
        });
    });

    // --- LÓGICA DE PUBLICAÇÃO ---
    publishButton.addEventListener('click', async () => {
        if (enviando) return;
        enviando = true;
        const textoBotao = publishButton.textContent;

        const payload = {
            titulo: document.getElementById('workout-title-display').textContent.trim(),
            descricao: workoutDescription.value.trim(),
            treinos: []
        };

        let allWorkoutsHaveExercises = true;
        document.querySelectorAll('.workout-column').forEach((column) => {
            const exercises = [];
            column.querySelectorAll('.exercise-item').forEach((item) => {
                exercises.push({
                    nome: item.querySelector('.exercise-name-display').textContent.trim(),
                    series_repeticoes: item.querySelector('.exercise-reps-display').textContent.trim()
                });
            });
            if (exercises.length === 0) allWorkoutsHaveExercises = false;

            payload.treinos.push({
                nome: column.querySelector('h3').textContent.trim(),
                exercicios: exercises
            });
        });

        if (!allWorkoutsHaveExercises) {
            alert('Cada treino deve ter pelo menos um exercício.');
            enviando = false;
            return;
        }
        if (document.querySelector('.exercise-input-item')) {
            alert('Salve ou cancele o exercício em edição antes de publicar.');
            enviando = false;
            return;
        }

        publishButton.disabled = true;
        publishButton.textContent = 'Publicando...';

        try {
            const criado = await criarTreino(payload);
            const avisoImagem = uploadedFile
                ? ' A imagem escolhida continua apenas nesta página e não foi salva.'
                : '';
            alert(`Treino criado. Identificador ${criado.id}.${avisoImagem}`);
        } catch (falha) {
            alert(mensagemParaUsuario(falha));
        } finally {
            enviando = false;
            publishButton.disabled = false;
            publishButton.textContent = textoBotao;
        }
    });
});

function mensagemParaUsuario(falha) {
    const texto = String(falha?.message || '');
    if (/postgres(ql)?:\/\//i.test(texto) || /DATABASE_URL/i.test(texto) || /\b(select|insert|update|delete)\b/i.test(texto)) {
        return 'Não foi possível criar o treino. Tente novamente.';
    }
    if (!falha?.status || falha.status >= 500 || texto.length > 160) {
        return 'Não foi possível criar o treino. Tente novamente.';
    }
    return texto || 'Não foi possível criar o treino. Tente novamente.';
}
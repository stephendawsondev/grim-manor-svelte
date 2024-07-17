import type { DialogueItem } from '$lib/types';
let dialogueQueue: DialogueItem[] = [];
let dialogueIndex = 0;

const showDialogueAsync = (dialogue: DialogueItem[], appendToContainer = false) => {
	return new Promise<void>((resolve) => {
		const parentElement = appendToContainer
			? document.getElementById('game-container')
			: document.body;

		let dialogueBox = parentElement?.querySelector('#dialogue-box');

		if (!dialogueBox) {
			dialogueBox = document.createElement('div');
			dialogueBox.id = 'dialogue-box';
			dialogueBox.classList.add('dialogue-box');
			const dialogueText = document.createElement('p');
			dialogueText.id = 'dialogue-text';
			dialogueBox.appendChild(dialogueText);
			const choicesContainer = document.createElement('div');
			choicesContainer.id = 'choices-container';
			const chevronRight = document.createElement('svg');
			chevronRight.classList.add('chevron-right');
			chevronRight.setAttribute('width', '50');
			chevronRight.setAttribute('height', '50');
			chevronRight.setAttribute('viewBox', '0 0 24 24');
			chevronRight.innerHTML = `<g>
      <path
        id="Vector"
        d="M10 8L14 12L10 16"
        stroke="#fffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>`;

			dialogueBox.appendChild(choicesContainer);
			dialogueBox.appendChild(chevronRight);
			if (parentElement) {
				parentElement.appendChild(dialogueBox);
			}
		}

		dialogueQueue = dialogue;
		dialogueIndex = 0;
		let isDialogueReady = false;
		let isChoiceMade = true;

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && isDialogueReady && isChoiceMade) {
				continueDialogue();
			}
		};

		const updateDialogue = () => {
			isDialogueReady = false;
			if (dialogueIndex < dialogueQueue.length) {
				dialogueBox.classList.add('active');
				const dialogueText: HTMLParagraphElement = dialogueBox.querySelector(
					'#dialogue-text'
				) as HTMLParagraphElement;
				const choicesContainer = dialogueBox.querySelector('#choices-container');

				if (dialogueText) {
					dialogueText.innerText = dialogueQueue[dialogueIndex].text;
				}
				if (choicesContainer) {
					choicesContainer.innerHTML = '';
				}

				if (dialogueQueue[dialogueIndex].choices) {
					isChoiceMade = false;
					document.addEventListener('keydown', handleKeyPress);
					const choices = dialogueQueue[dialogueIndex]?.choices;
					if (choices) {
						for (const choice of choices) {
							document?.querySelector('.chevron-right')?.classList.remove('display');
							const choiceButton = document.createElement('a');

							if (choice.link && choice.link !== '') {
								choiceButton.href = choice.link;
							} else {
								choiceButton.href = '#';
							}
							choiceButton.classList.add('choice-button');
							choiceButton.innerText = choice.text;
							choiceButton.addEventListener('click', (event) => {
								event.stopPropagation();
								isChoiceMade = true;
								if (choice.action) {
									const actionResult = choice.action();
									if (actionResult && actionResult.newDialogue) {
										dialogueQueue.splice(dialogueIndex + 1, 0, actionResult.newDialogue);
									}
								}
								dialogueIndex++;
								updateDialogue();
							});
							if (choicesContainer) choicesContainer.appendChild(choiceButton);
						}
					}
				} else {
					const chevronRight: SVGElement | null = document.querySelector('.chevron-right');
					if (chevronRight) {
						chevronRight.classList.add('display');
						document.addEventListener('keydown', handleKeyPress);
						isChoiceMade = true;
					}
				}

				setTimeout(() => {
					isDialogueReady = true;
					if (isChoiceMade) {
						dialogueBox.addEventListener('click', continueDialogue, {
							once: true
						});
					}
				}, 0);
			} else {
				dialogueBox.classList.remove('active');
				document.removeEventListener('keydown', handleKeyPress);
				resolve();
			}
		};

		const continueDialogue = () => {
			if (isDialogueReady && isChoiceMade) {
				dialogueIndex++;
				updateDialogue();
			}
		};

		updateDialogue();
	});
};

export { showDialogueAsync };

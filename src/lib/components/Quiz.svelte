<!-- quiz -->
<div class="minigame" id="quiz-game">
	<div class="text-center quiz-container">
		<h2>Halloween Quiz</h2>
		<!-- play button -->
		<button id="play-button" class="btn btn-lg hvr-outline-in"> Play </button>
		<!-- quiz question card -->
		<div id="question-card" class="card d-none">
			<img id="question-image" class="card-img-top" src="" alt="" />
			<div class="card-body">
				<!-- <h5 id="question-text" class="card-title"></h5> -->
				<div id="answer-buttons"></div>
			</div>
		</div>
		<!-- quiz result card -->
		<div id="result-card" class="card d-none">
			<div class="card-body">
				<!-- <h5 id="result-text" class="card-title"></h5> -->
				<p id="correct-answer" class="card-text"></p>
				<button id="next-button" class="btn btn-lg btn-dark"> Next </button>
			</div>
		</div>
		<!-- quiz score card -->
		<div id="score-card" class="card d-none">
			<div class="card-body">
				<!-- <h5 id="score-text" class="card-title"></h5> -->
				<img
					id="gift-card"
					class="card-img-top d-none"
					src="./images/mansion-with-trees.webp"
					alt="a spooky mansion with trees"
				/>
				<p id="failure-text" class="card-text d-none">
					Sorry, you didn't score high enough to get to the next stage.
				</p>
				<button id="play-again-button" class="btn btn-lg btn-dark"> Play Again </button>
				<button id="end-quiz-button" class="btn btn-lg btn-dark"> End Quiz </button>
			</div>
		</div>
		<!-- end quiz card -->
		<div>
			<div id="end-card" class="card d-none">
				<div class="card-body">
					<!-- <h5 id="end-text" class="card-title"></h5> -->
					<button id="home-button" class="btn btn-lg btn-danger hvr-pop"> Exit </button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- end of quiz game -->

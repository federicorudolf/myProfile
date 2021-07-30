<script>
  import CircleAnimation from './Utils/CircleAnimation.svelte';
  import Main from './Sections/Main.svelte';
  import Skills from './Sections/Skills.svelte';

  var title = '';
  const TIME = 200;

  function* iterateGreetings () {
    let greetings = [
      'Hola',
      'Hello',
      'Ciao',
      'Hallo',
      'Ahoj',
      'Salut',
      'Aloha',
      'こんにちは',
      'Привет',
      'Olá'
    ];
    for (let i = 0; i < greetings.length; i++) {
      yield greetings[i];
    }
  }

  let greeting = iterateGreetings();

  const writeTitles = () => {
    let { value, done } = greeting.next();
    title = '';
    if (!done) {
      value = value.split('');
      setTimeout(() => {
        value.forEach((letter, index) => {
          /* Iterate letters */
          setTimeout(() => {
            title += letter;
          }, TIME * (index + 1));
          /* End of word */
          if (index === value.length - 1) {
            setTimeout( writeTitles, 2 * TIME * (value.length + 1));
          }
        });
      }, TIME * value.length)
    } else {
      greeting = iterateGreetings();
      writeTitles();
    }
  }

  writeTitles();

</script>

<main class="mainContainer">
  <CircleAnimation />
  <Main title={title} />
  <Skills />
</main>

<style lang="scss">
	.mainContainer {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    font-family: $mainFont !important;
    font-weight: 300;
    background-color: $mainBackgroundColor;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
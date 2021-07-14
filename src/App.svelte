<script>
  import CircleAnimation from './Utils/CircleAnimation.svelte';
  import Header from './Shared/Header.svelte';

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
          setTimeout(() => {
            title += letter;
          }, TIME * (index + 1));
          if (index === value.length - 1) {
            setTimeout( writeTitles, TIME * (value.length + 1));
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
  <section class="mainContainer__first">
    <Header />
    <h1 class="mainContainer__first__title"> {title.length ? title : ''} </h1>
  </section>
</main>

<style lang="scss">
  @import '../public/assets/styles/variables.scss';
	.mainContainer {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    font-family: $mainFont;
    font-weight: 300;
    background-color: $mainBackgroundColor;
    
    &__first {
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      @include widthHeight(100%, 100%);

      &__title {
        color: $mainColor;
        text-transform: uppercase;
        font-size: 6em;
        font-weight: 100;
      }
    }
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
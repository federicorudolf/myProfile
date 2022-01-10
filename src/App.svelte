<script>
  if ('serviceWorker' in navigator) {
    console.log('registering');
    navigator.serviceWorker
      .register('./sw.js')
      .then(
        res => console.log('serviceWorker registered', res),
        err => console.log(err)
      )
  }
  import CircleAnimation from './Utils/CircleAnimation.svelte';
  import Main from './Sections/Main.svelte';
  import Skills from './Sections/Skills.svelte';
  import { getBitcoinPrice } from './Services/main.service';
  import { onMount } from 'svelte';
  import { btcData, isMobile } from './Store/store';

  let title = '';
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

  function navigateTo(event) {

  }

  onMount(() => {
    isMobile.update(() => window.innerWidth < 768);
    getBitcoinPrice()
      .then(res => {
        btcData.update(() => ({ ...res.data[0] }))
      })
      .catch(err => console.log(err));
    window.addEventListener('resize', () => {
      isMobile.update(() => window.innerWidth < 768);
    })
  });

  writeTitles();

</script>

<svelte:body></svelte:body>

<main class="mainContainer">
  <CircleAnimation />
  <Main on:navigate-to="{ navigateTo }" title={title} />
  <Skills />
</main>

<style lang="scss">
	.mainContainer {
		text-align: center;
		padding: 1em;
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
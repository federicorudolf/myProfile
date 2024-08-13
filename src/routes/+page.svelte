<script>
  // @ts-ignore
  import Circles from '$lib/components/Circles.svelte';

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
      // @ts-ignore
      value = value.split('');
      setTimeout(() => {
        // @ts-ignore
        value.forEach((letter, index) => {
          /* Iterate letters */
          setTimeout(() => {
            title += letter;
          }, TIME * (index + 1));
          /* End of word */
          // @ts-ignore
          if (index === value.length - 1) {
            // @ts-ignore
            setTimeout( writeTitles, 2 * TIME * (value.length + 1));
          }
        });
      // @ts-ignore
      }, TIME * value.length)
    } else {
      greeting = iterateGreetings();
      writeTitles();
    }
  }

  writeTitles();
</script>

<section class="main">
  <Circles />
  <h1 class="gradient-text text-8xl"> { title.length ? title : '' } </h1>
</section>

<style>
  .main {
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

</style>
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

  const scrollDown = () => {
    console.log('scrolling', window.innerHeight, window.scrollY);
    window.scrollTo({
      top: window.innerHeight * 0.95,
      left: 0,
      behavior: 'smooth'
    });
  }

  writeTitles();
</script>

<section class="main relative">
  <Circles />
  <h1 class="gradient-text text-6xl md:text-8xl xl:text-12xl whitespace-nowrap"> { title.length ? title : '' } </h1>
  <button on:click={scrollDown} class="btn btn-circle btn-outline absolute mx-auto bottom-3 h-16 w-16 text-center"> 
    <img src="/icons/arrow_down.svg" alt="arrow down">
  </button>
</section>
<section class="min-h-screen flex flex-column justify-center content-center">

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
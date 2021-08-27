<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte'
  export let skillTitle;
  export let skillLevel;
  export let skillLevelText;
  export let fadeInCoords;
  export let id;

  let context, canvas;

  onMount( () => {
    canvas = document.getElementById(`skillCanvas_${id}`);
    let skillContainer = document.getElementsByClassName('skillContainer')[0];
    canvas.width = 300;
    canvas.height = 300;
    context = canvas.getContext('2d');
    drawShape('base');
    drawShape('fill')
  });

  function drawShape(type) {
    const radius = 100;
    const x = (canvas.width / 2);
    const y = (canvas.height / 2);
    const rad = 2 * Math.PI;
    const startPath = type === 'base' ?
      rad - (7 / 4) * Math.PI : rad + skillLevel;
    const endPath = rad - (5 / 4) * Math.PI;

    context.strokeStyle = type === 'base' ? '#888888' : '#ff3e00';
    context.lineWidth = 10;
    context.beginPath();
    context.fillStyle = '#ff3e00';
    context.font = '50px IBM Plex Mono, monospace';
    context.fillText(skillLevelText, x - 35, y);
		context.arc(x, y, radius, startPath , endPath , true);
		context.stroke();
  }


</script>

<div class="skillContainer"
  in:fly="{{ x: fadeInCoords.x, y: fadeInCoords.y  }}">
  <h3 class="skillContainer__title"> { skillTitle } </h3>
  <canvas width="300" height="300" class="skillCanvas" id="{`skillCanvas_${id}`}"></canvas>
</div>

<style lang="scss">
  .skillContainer {
    @include maxWidthHeight( 300px, 300px);
    @include minWidthHeight( 300px, 300px);
    @include margin(5%, 5%);
    @include padding(2%, 2%);
    @include boxShadow;
    border: 1px solid $mainColor;
    border-radius: 5%;
  }

  .skillCanvas {
    @include widthHeight(90% !important, 90% !important);
  }

</style>
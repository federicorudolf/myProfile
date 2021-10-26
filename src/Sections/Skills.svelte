<script>
/* import Skill from '../Components/Skill.svelte'; */
  /* import  */
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';

  const title = 'Skills';
  const skills = [
    {
      skillTitle: 'JavaScript',
      skillLevel: 73,
      skillLevelText: '95%',
      fadeinCoords: { x: -500, y: 0 },
      id: 0
    },
    {
      skillTitle: 'Angular',
      skillLevel: 90,
      skillLevelText: '90%',
      fadeinCoords: { x: -500, y: 0 },
      id: 1
    },
    {
      skillTitle: 'Vue.JS',
      skillLevel: 70,
      skillLevelText: '70%',
      fadeinCoords: { x: -500, y: 0 },
      id: 2
    },
  ];

  const skillsData = {
    labels: [
      'JavaScript',
      'Angular',
      'Vue.js',
      'React',
      'Svelte.js',
      'Node.js',
      'Swift',
      'Agile',
      'English'
    ],
    datasets: [
      {
        label: 'Skills',
        data: [95, 90, 60, 75, 60, 50, 40, 75, 90],
        fill: true,
        backgroundColor: 'rgba(255, 62, 0, 0.2)',
        borderColor: '#ff3e00',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
        pointHoverRaidus: 4
      },
      {
        label: '',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointHoverBorderColor: 'transparent',
      }
    ]
  };

  onMount(() => {
    Chart.register(...registerables);
    const canvas = document.getElementById('skillsCanvas');
    
    let skillChart = new Chart(canvas, {
      type: 'radar',
      data: skillsData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          }
        },
        elements: {
          line: {
            borderWidth: 3
          }
        },
        responsive: true,
      }
    });
  }); 

</script>

<section class="skills">
  <h1 class="skills__title mb-5 mt-5"> { title } </h1>
  <div class="skills__container d-flex flex-row flex-wrap align-items-center justify-content-center">
  <canvas id="skillsCanvas"></canvas>
<!--     {#each skills as skill}
      <Skill { ...skill } />
    {/each} -->
  </div>
</section>

<style lang="scss">
  .skills {
    @include widthHeight(100%, auto);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    &__title {
        color: $lightGray;
        font-size: 3em;
      }
  }

  #skillsCanvas {
    @include widthHeight(90% !important, 90% !important);
  }
</style>
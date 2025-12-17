<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { PageData } from './$types';

  export let data: PageData;

  // Skills data - we can expand this later
  const skills = [
    { name: 'JavaScript', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Frontend' },
    { name: 'Svelte', level: 80, category: 'Frontend' },
    { name: 'React', level: 85, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Backend' },
    { name: 'HTML/CSS', level: 95, category: 'Frontend' },
    { name: 'SQL', level: 70, category: 'Database' },
  ];

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    const ctx = chartCanvas.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: skills.map(skill => skill.name),
          datasets: [{
            label: 'Proficiency Level',
            data: skills.map(skill => skill.level),
            backgroundColor: 'rgba(255, 62, 0, 0.2)',
            borderColor: 'rgba(255, 62, 0, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 62, 0, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 62, 0, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
                color: '#9ca3af'
              },
              grid: {
                color: 'rgba(156, 163, 175, 0.2)'
              },
              pointLabels: {
                color: '#d1d5db',
                font: {
                  size: 14
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#d1d5db',
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
</script>

<section class="skills-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 gradient-text text-center">Skills & Expertise</h1>
    <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      A comprehensive overview of my technical skills and proficiency levels across various technologies and domains.
    </p>

    <!-- Chart Container -->
    <div class="chart-container mb-16 bg-gray-800/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700">
      <canvas bind:this={chartCanvas}></canvas>
    </div>

    <!-- Skills List by Category -->
    <div class="skills-grid grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each Object.entries(skillsByCategory) as [category, categorySkills]}
        <div class="category-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <h2 class="text-2xl font-bold mb-4 text-gray-200">{category}</h2>
          <div class="space-y-4">
            {#each categorySkills as skill}
              <div class="skill-item">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-300">{skill.name}</span>
                  <span class="text-gray-400">{skill.level}%</span>
                </div>
                <div class="skill-bar bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    class="skill-progress bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000"
                    style="width: {skill.level}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .skills-section {
    padding-top: 80px;
  }

  .chart-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .skill-bar {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .skill-progress {
    box-shadow: 0 0 10px rgba(255, 62, 0, 0.5);
  }

  .category-card {
    transition: all 0.3s ease;
  }

  .category-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 62, 0, 0.5);
  }
</style>

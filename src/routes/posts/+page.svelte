<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Publications data - you can add your actual Medium posts and other content here
  const publications = [
    {
      title: 'Sample Article Title',
      description: 'A brief description of the article content, explaining what readers will learn and why it matters.',
      date: '2024-01-15',
      platform: 'Medium',
      url: 'https://medium.com/@yourprofile/article-slug',
      tags: ['JavaScript', 'Web Development', 'Tutorial'],
      readTime: '5 min read'
    },
    {
      title: 'Another Publication',
      description: 'This is another example publication. Replace these with your actual blog posts and articles.',
      date: '2024-02-20',
      platform: 'Medium',
      url: 'https://medium.com/@yourprofile/another-article',
      tags: ['TypeScript', 'Best Practices'],
      readTime: '8 min read'
    },
    {
      title: 'Technical Deep Dive',
      description: 'An in-depth exploration of a technical topic, showcasing your expertise and teaching abilities.',
      date: '2024-03-10',
      platform: 'Dev.to',
      url: 'https://dev.to/yourprofile/article',
      tags: ['React', 'Performance', 'Advanced'],
      readTime: '12 min read'
    }
  ];

  // Platform colors
  const platformColors: Record<string, string> = {
    'Medium': 'bg-green-600',
    'Dev.to': 'bg-purple-600',
    'Personal Blog': 'bg-blue-600',
    'Other': 'bg-gray-600'
  };

  // Format date
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<section class="publications-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 gradient-text text-center">Publications</h1>
    <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      Articles, tutorials, and technical writings sharing knowledge and insights with the developer community.
    </p>

    <!-- Publications Grid -->
    <div class="publications-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each publications as publication}
        <article class="publication-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 flex flex-col">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-200 mb-2 hover:text-orange-500 transition-colors">
                <a href={publication.url} target="_blank" rel="noopener noreferrer">
                  {publication.title}
                </a>
              </h2>
              <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span class="platform-badge {platformColors[publication.platform] || platformColors.Other} px-3 py-1 rounded-full text-white text-xs font-semibold">
                  {publication.platform}
                </span>
                <span>{formatDate(publication.date)}</span>
                <span>•</span>
                <span>{publication.readTime}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-gray-300 mb-4 flex-1">
            {publication.description}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            {#each publication.tags as tag}
              <span class="tag bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300">
                #{tag}
              </span>
            {/each}
          </div>

          <!-- Read More Link -->
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            class="read-more-link inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-semibold"
          >
            Read Article
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </a>
        </article>
      {/each}
    </div>

    <!-- Empty State (show this if no publications) -->
    {#if publications.length === 0}
      <div class="empty-state text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="mx-auto mb-4 text-gray-600" viewBox="0 0 16 16">
          <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
        </svg>
        <p class="text-gray-400 text-lg">No publications yet. Check back soon!</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .publications-section {
    padding-top: 80px;
  }

  .publication-card {
    transition: all 0.3s ease;
  }

  .publication-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 62, 0, 0.5);
  }

  .read-more-link svg {
    transition: transform 0.3s ease;
  }

  .read-more-link:hover svg {
    transform: translateX(4px);
  }

  .tag {
    transition: all 0.3s ease;
  }

  .tag:hover {
    background-color: rgba(255, 62, 0, 0.2);
    color: rgba(255, 62, 0, 1);
  }
</style>

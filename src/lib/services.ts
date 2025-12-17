export interface MediumArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  categories?: string[];
}

export interface RSS2JSONResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: MediumArticle[];
}

export const fetchMediumArticles = async (): Promise<MediumArticle[]> => {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@federicorudolf'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RSS2JSONResponse = await response.json();

    if (data.status === 'ok') {
      console.log('Medium articles fetched:', data.items.length);
      return data.items;
    } else {
      console.error('RSS2JSON returned error status');
      return [];
    }
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
};

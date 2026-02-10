package com.devspark.ingestion;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RssFetcherTest {
    @Test
    void fetcherStoresNewArticlesAndDedupeByUrl() {
        InMemoryArticleRepository repository = new InMemoryArticleRepository();
        RssFetcher fetcher = new RssFetcher(repository);

        String feed = """
            <?xml version=\"1.0\"?>
            <rss version=\"2.0\">
              <channel>
                <title>Example Feed</title>
                <item>
                  <title>Post One</title>
                  <link>https://example.com/post-1</link>
                </item>
                <item>
                  <title>Post One Duplicate</title>
                  <link>https://example.com/post-1</link>
                </item>
              </channel>
            </rss>
            """;

        fetcher.fetch(feed);

        assertThat(repository.count()).isEqualTo(1);
        assertThat(repository.findAll().get(0).url()).isEqualTo("https://example.com/post-1");
    }
}

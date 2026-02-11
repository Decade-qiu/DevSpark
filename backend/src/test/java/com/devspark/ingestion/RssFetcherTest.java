package com.devspark.ingestion;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class RssFetcherTest {

    @Test
    void shouldParseRssFeed() {
        InMemoryArticleRepository repository = new InMemoryArticleRepository();
        // Since we cannot easily inject HttpClient, we test the package-private parseAndSave method directly
        // However, RssFetcher constructor creates HttpClient. That's fine as long as we don't call fetch().
        RssFetcher fetcher = new RssFetcher(repository);

        String feedXml = """
            <rss version="2.0">
                <channel>
                    <title>Example Feed</title>
                    <item>
                        <title>Post Title</title>
                        <link>https://example.com/post-1</link>
                        <description>This is a summary</description>
                        <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
                    </item>
                </channel>
            </rss>
            """;

        fetcher.parseAndSave(feedXml, "Test Source");

        assertThat(repository.count()).isEqualTo(1);
        ArticleRecord record = repository.findAll().get(0);
        assertThat(record.title()).isEqualTo("Post Title");
        assertThat(record.link()).isEqualTo("https://example.com/post-1");
        assertThat(record.source()).isEqualTo("Test Source");
        assertThat(record.summary()).isEqualTo("This is a summary");
    }
}

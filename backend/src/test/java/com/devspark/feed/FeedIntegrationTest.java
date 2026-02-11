package com.devspark.feed;

import com.devspark.ingestion.InMemoryArticleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class FeedIntegrationTest {

    @Autowired
    private FeedService feedService;

    @Autowired
    private InMemoryArticleRepository repository;

    @Test
    void shouldFetchAndStoreArticles() {
        // Trigger fetch manually
        feedService.fetchAllFeeds();

        // Wait for async fetch (or assume fetchAllFeeds blocks but HttpClient is async? No, HttpClient.send is sync in my code)
        // My code: httpClient.send(..., BodyHandlers.ofString()); <-- This is synchronous blocking IO. 
        // So fetchAllFeeds() blocks until all feeds are fetched sequentially.
        
        // Assert repository has data
        assertTrue(repository.count() > 0, "Repository should have articles after fetching");
        
        System.out.println("Fetched " + repository.count() + " articles.");
        repository.findAll().stream().limit(5).forEach(a -> 
            System.out.println(" - " + a.title() + " (" + a.source() + ")")
        );
    }
}

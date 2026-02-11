package com.devspark.feed;

import com.devspark.ingestion.ArticleRecord;
import com.devspark.ingestion.InMemoryArticleRepository;
import com.devspark.ingestion.RssFetcher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FeedService {
    private final RssFetcher rssFetcher;
    private final InMemoryArticleRepository repository;

    // Built-in sources
    private static final Map<String, String> DEFAULT_SOURCES = Map.of(
        "Hacker News", "https://news.ycombinator.com/rss",
        "The Verge", "https://www.theverge.com/rss/index.xml",
        "Wired", "https://www.wired.com/feed/rss",
        "TechCrunch", "https://techcrunch.com/feed/"
    );

    // User-added sources (name -> url)
    private final Map<String, String> customSources = new ConcurrentHashMap<>();

    public FeedService(RssFetcher rssFetcher, InMemoryArticleRepository repository) {
        this.rssFetcher = rssFetcher;
        this.repository = repository;
    }

    /** Returns all sources (default + custom). */
    public Map<String, String> getAllSources() {
        Map<String, String> all = new LinkedHashMap<>(DEFAULT_SOURCES);
        all.putAll(customSources);
        return all;
    }

    /** Add a custom source. Returns the feed title from validation, or null. */
    public String addSource(String name, String url) {
        String feedTitle = rssFetcher.validateFeed(url);
        if (feedTitle == null) return null;

        String sourceName = (name != null && !name.isBlank()) ? name : feedTitle;
        customSources.put(sourceName, url);

        // Fetch articles for the new source immediately
        rssFetcher.fetch(url, sourceName);

        return sourceName;
    }

    /** Validate a feed URL. Returns the feed title or null. */
    public String validateSource(String url) {
        return rssFetcher.validateFeed(url);
    }

    /** Remove a custom source by name. */
    public boolean removeSource(String name) {
        return customSources.remove(name) != null;
    }

    /** List custom source names. */
    public List<Map<String, String>> listCustomSources() {
        List<Map<String, String>> result = new ArrayList<>();
        customSources.forEach((name, url) -> result.add(Map.of("name", name, "url", url)));
        return result;
    }

    @Scheduled(fixedRate = 300000)
    public void fetchAllFeeds() {
        getAllSources().forEach((name, url) -> {
            System.out.println("Fetching " + name + "...");
            rssFetcher.fetch(url, name);
        });
    }

    public List<ArticleRecord> getRecentArticles() {
        return repository.findAll();
    }

    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    public void onStartup() {
        fetchAllFeeds();
    }
}

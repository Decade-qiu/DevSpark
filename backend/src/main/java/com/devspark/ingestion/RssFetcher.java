package com.devspark.ingestion;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

@org.springframework.stereotype.Component
public class RssFetcher {
    private final InMemoryArticleRepository repository;
    private final ArticleContentFetcher contentFetcher;
    private final java.net.http.HttpClient httpClient;

    public RssFetcher(InMemoryArticleRepository repository, ArticleContentFetcher contentFetcher) {
        this.repository = repository;
        this.contentFetcher = contentFetcher;
        this.httpClient = java.net.http.HttpClient.newBuilder()
                .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                .build();
    }

    public void fetch(String feedUrl, String sourceName) {
        try {
            var request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(feedUrl))
                .header("User-Agent", "DevSpark/1.0 RSS Reader")
                .GET()
                .timeout(java.time.Duration.ofSeconds(15))
                .build();

            var response = httpClient.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                parseAndSave(response.body(), sourceName);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch feed: " + feedUrl + " - " + e.getMessage());
        }
    }

    /**
     * Validates that a feed URL returns parseable RSS or Atom content.
     * Returns the feed title or null if invalid.
     */
    public String validateFeed(String feedUrl) {
        try {
            var request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(feedUrl))
                .header("User-Agent", "DevSpark/1.0 RSS Reader")
                .GET()
                .timeout(java.time.Duration.ofSeconds(10))
                .build();

            var response = httpClient.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return null;

            var factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            Document document = factory.newDocumentBuilder()
                .parse(new ByteArrayInputStream(response.body().getBytes(StandardCharsets.UTF_8)));

            // Check for RSS
            NodeList channels = document.getElementsByTagName("channel");
            if (channels.getLength() > 0) {
                var children = channels.item(0).getChildNodes();
                for (int i = 0; i < children.getLength(); i++) {
                    if ("title".equals(children.item(i).getNodeName())) {
                        return children.item(i).getTextContent();
                    }
                }
                return "RSS Feed";
            }

            // Check for Atom
            NodeList feeds = document.getElementsByTagName("feed");
            if (feeds.getLength() > 0) {
                var children = feeds.item(0).getChildNodes();
                for (int i = 0; i < children.getLength(); i++) {
                    String name = children.item(i).getLocalName();
                    if (name == null) name = children.item(i).getNodeName();
                    if ("title".equals(name)) {
                        return children.item(i).getTextContent();
                    }
                }
                return "Atom Feed";
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    void parseAndSave(String feedXml, String sourceName) {
        try {
            var factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            Document document = factory.newDocumentBuilder()
                .parse(new ByteArrayInputStream(feedXml.getBytes(StandardCharsets.UTF_8)));

            // Try RSS <item> elements first
            NodeList items = document.getElementsByTagName("item");
            if (items.getLength() > 0) {
                parseRssItems(items, sourceName);
            } else {
                // Try Atom <entry> elements
                NodeList entries = document.getElementsByTagName("entry");
                if (entries.getLength() > 0) {
                    parseAtomEntries(entries, sourceName);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void parseRssItems(NodeList items, String sourceName) {
        for (int i = 0; i < items.getLength(); i++) {
            var item = items.item(i);
            var children = item.getChildNodes();
            String title = null;
            String link = null;
            String description = null;
            String pubDateStr = null;
            String contentEncoded = null;

            for (int j = 0; j < children.getLength(); j++) {
                var child = children.item(j);
                String nodeName = child.getNodeName();

                if ("title".equals(nodeName)) title = child.getTextContent();
                else if ("link".equals(nodeName)) link = child.getTextContent();
                else if ("description".equals(nodeName)) description = child.getTextContent();
                else if ("pubDate".equals(nodeName)) pubDateStr = child.getTextContent();
                else if ("content:encoded".equals(nodeName)) contentEncoded = child.getTextContent();
            }

            if (link != null && !repository.existsByUrl(link)) {
                java.time.Instant pubDate = parseDate(pubDateStr);
                String content = contentEncoded != null ? contentEncoded : description;

                // If content is too short, fetch the full article
                if (contentFetcher.needsFullContent(content)) {
                    String fullContent = contentFetcher.fetchFullContent(link);
                    if (fullContent != null) {
                        content = fullContent;
                    }
                }

                String imageUrl = extractImage(content);

                repository.save(new ArticleRecord(
                    title, link, sourceName, pubDate,
                    description != null ? description : stripToSummary(content),
                    content,
                    imageUrl
                ));
            }
        }
    }

    private void parseAtomEntries(NodeList entries, String sourceName) {
        for (int i = 0; i < entries.getLength(); i++) {
            var entry = (Element) entries.item(i);
            var children = entry.getChildNodes();
            String title = null;
            String link = null;
            String summary = null;
            String content = null;
            String updatedStr = null;
            String publishedStr = null;

            for (int j = 0; j < children.getLength(); j++) {
                var child = children.item(j);
                String localName = child.getLocalName();
                if (localName == null) localName = child.getNodeName();

                switch (localName) {
                    case "title":
                        title = child.getTextContent();
                        break;
                    case "link":
                        if (child instanceof Element el) {
                            String href = el.getAttribute("href");
                            String rel = el.getAttribute("rel");
                            if (link == null || "alternate".equals(rel)) {
                                link = href != null && !href.isEmpty() ? href : child.getTextContent();
                            }
                        }
                        break;
                    case "summary":
                        summary = child.getTextContent();
                        break;
                    case "content":
                        content = child.getTextContent();
                        break;
                    case "updated":
                        updatedStr = child.getTextContent();
                        break;
                    case "published":
                        publishedStr = child.getTextContent();
                        break;
                    default:
                        break;
                }
            }

            if (link != null && !repository.existsByUrl(link)) {
                java.time.Instant pubDate = parseDate(publishedStr != null ? publishedStr : updatedStr);
                String articleContent = content != null ? content : summary;

                // If content is too short, fetch the full article
                if (contentFetcher.needsFullContent(articleContent)) {
                    String fullContent = contentFetcher.fetchFullContent(link);
                    if (fullContent != null) {
                        articleContent = fullContent;
                    }
                }

                String imageUrl = extractImage(articleContent);

                repository.save(new ArticleRecord(
                    title, link, sourceName, pubDate,
                    summary != null ? summary : stripToSummary(articleContent),
                    articleContent,
                    imageUrl
                ));
            }
        }
    }

    private String stripToSummary(String html) {
        if (html == null) return "";
        String text = org.jsoup.Jsoup.parse(html).text();
        if (text.length() <= 300) return text;
        return text.substring(0, 297) + "...";
    }

    private java.time.Instant parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return java.time.Instant.now();

        try {
            return java.time.format.DateTimeFormatter.RFC_1123_DATE_TIME
                .parse(dateStr.trim(), java.time.Instant::from);
        } catch (Exception ignored) {}

        try {
            return java.time.Instant.parse(dateStr.trim());
        } catch (Exception ignored) {}

        try {
            return java.time.OffsetDateTime.parse(dateStr.trim()).toInstant();
        } catch (Exception ignored) {}

        return java.time.Instant.now();
    }

    private String extractImage(String html) {
        if (html == null) return null;
        var matcher = java.util.regex.Pattern.compile("src=\"(https?://[^\"]+(?:\\.(?:jpg|jpeg|png|gif|webp|svg))[^\"]*)\"",
            java.util.regex.Pattern.CASE_INSENSITIVE).matcher(html);
        if (matcher.find()) {
            return matcher.group(1);
        }
        // Fallback: any src
        var matcher2 = java.util.regex.Pattern.compile("src=\"(https?://[^\"]+)\"").matcher(html);
        if (matcher2.find()) {
            return matcher2.group(1);
        }
        return null;
    }
}

package com.devspark.ingestion;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

/**
 * Fetches the full article content from the original URL when the RSS feed
 * only provides a summary or no content at all.
 */
@Component
public class ArticleContentFetcher {

    private static final int MIN_CONTENT_LENGTH = 200;
    private static final int FETCH_TIMEOUT_MS = 10000;

    /**
     * Returns true if the RSS-provided content looks incomplete and should be
     * fetched from the original page.
     */
    public boolean needsFullContent(String rssContent) {
        if (rssContent == null || rssContent.isBlank()) return true;

        // Strip HTML tags, then check plain text length
        String text = Jsoup.parse(rssContent).text();
        return text.length() < MIN_CONTENT_LENGTH;
    }

    /**
     * Fetches the original article page and extracts the main content as
     * sanitised HTML.  Returns null if extraction fails.
     */
    public String fetchFullContent(String articleUrl) {
        try {
            Document doc = Jsoup.connect(articleUrl)
                    .userAgent("DevSpark/1.0 RSS Reader")
                    .timeout(FETCH_TIMEOUT_MS)
                    .followRedirects(true)
                    .get();

            // Remove non-content noise
            doc.select("script, style, nav, footer, header, aside, .ad, .ads, "
                    + ".advertisement, .social-share, .comments, .related, "
                    + ".sidebar, .menu, .navigation, .cookie, .popup, "
                    + "#comments, #sidebar, #footer, #header, #nav").remove();

            // Strategy 1: look for <article> element
            Element article = doc.selectFirst("article");
            if (article != null && article.text().length() >= MIN_CONTENT_LENGTH) {
                return cleanHtml(article);
            }

            // Strategy 2: common content selectors
            String[] selectors = {
                    "[role=main]",
                    "main",
                    ".post-content",
                    ".article-content",
                    ".article-body",
                    ".entry-content",
                    ".story-body",
                    ".content-body",
                    ".post-body",
                    "#article-body",
                    ".article__content",
            };
            for (String sel : selectors) {
                Element el = doc.selectFirst(sel);
                if (el != null && el.text().length() >= MIN_CONTENT_LENGTH) {
                    return cleanHtml(el);
                }
            }

            // Strategy 3: largest <div> by text length
            Element best = null;
            int bestLen = 0;
            for (Element div : doc.select("div")) {
                int len = div.text().length();
                // Also check it has multiple paragraphs
                int pCount = div.select("p").size();
                if (len > bestLen && pCount >= 2) {
                    bestLen = len;
                    best = div;
                }
            }
            if (best != null && bestLen >= MIN_CONTENT_LENGTH) {
                return cleanHtml(best);
            }

            return null;
        } catch (Exception e) {
            System.err.println("Failed to fetch full content from: " + articleUrl + " - " + e.getMessage());
            return null;
        }
    }

    private String cleanHtml(Element element) {
        // Allow a generous set of content tags, strip everything else
        Safelist safelist = Safelist.relaxed()
                .addTags("figure", "figcaption", "picture", "source", "video", "audio", "iframe")
                .addAttributes("img", "src", "alt", "title", "width", "height", "loading")
                .addAttributes("a", "href", "title", "target", "rel")
                .addAttributes("iframe", "src", "width", "height", "frameborder", "allowfullscreen", "allow")
                .addAttributes("video", "src", "poster", "controls", "width", "height")
                .addAttributes("audio", "src", "controls")
                .addAttributes("source", "src", "type")
                .addProtocols("img", "src", "http", "https", "data")
                .addProtocols("a", "href", "http", "https", "mailto")
                .preserveRelativeLinks(false);

        return Jsoup.clean(element.html(), element.baseUri(), safelist);
    }
}

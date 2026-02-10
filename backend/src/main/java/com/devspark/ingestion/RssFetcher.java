package com.devspark.ingestion;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

class RssFetcher {
    private final InMemoryArticleRepository repository;

    RssFetcher(InMemoryArticleRepository repository) {
        this.repository = repository;
    }

    void fetch(String feedXml) {
        try {
            Document document = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder()
                .parse(new ByteArrayInputStream(feedXml.getBytes(StandardCharsets.UTF_8)));

            NodeList items = document.getElementsByTagName("item");
            for (int i = 0; i < items.getLength(); i++) {
                var item = items.item(i);
                var children = item.getChildNodes();
                String title = null;
                String link = null;
                for (int j = 0; j < children.getLength(); j++) {
                    var child = children.item(j);
                    if ("title".equals(child.getNodeName())) {
                        title = child.getTextContent();
                    }
                    if ("link".equals(child.getNodeName())) {
                        link = child.getTextContent();
                    }
                }
                if (link != null && !repository.existsByUrl(link)) {
                    repository.save(new ArticleRecord(title, link));
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse feed", e);
        }
    }
}

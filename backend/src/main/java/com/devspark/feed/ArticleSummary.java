package com.devspark.feed;

public record ArticleSummary(
    String id, 
    String title,
    String summary,
    String source,
    String publishTime,
    String content,
    String imageUrl
) {}

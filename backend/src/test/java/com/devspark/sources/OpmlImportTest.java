package com.devspark.sources;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class OpmlImportTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void importOpmlCreatesSources() throws Exception {
        String opml = """
            <?xml version=\"1.0\" encoding=\"UTF-8\"?>
            <opml version=\"1.0\">
              <body>
                <outline text=\"Example\" xmlUrl=\"https://example.com/rss.xml\" />
              </body>
            </opml>
            """;

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "subscriptions.opml",
            MediaType.TEXT_XML_VALUE,
            opml.getBytes()
        );

        mockMvc.perform(multipart("/api/sources/import-opml").file(file))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(1));
    }
}

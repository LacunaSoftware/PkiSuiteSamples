package com.lacunasoftware.pkisuite;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	/**
	 * Moves the gson converter (see application.yml) ahead of the String converter, as Spring Boot
	 * 1.5 did. The batch APIs (api folder) return a String, a token or a file id, and their pages
	 * read the response with jQuery's dataType 'json', so the String must be written as JSON.
	 */
	@Override
	public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		converters.stream()
			.filter(converter -> converter instanceof GsonHttpMessageConverter)
			.findFirst()
			.ifPresent(gson -> {
				converters.remove(gson);
				converters.add(0, gson);
			});
	}
}

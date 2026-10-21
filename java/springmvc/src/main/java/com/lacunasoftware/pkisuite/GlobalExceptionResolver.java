package com.lacunasoftware.pkisuite;

import com.lacunasoftware.pkisuite.api.model.ErrorModel;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.webmvc.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class GlobalExceptionResolver {

	@Component
	private static class MvcHandler extends AbstractHandlerExceptionResolver {

		@Override
		protected ModelAndView doResolveException(
				HttpServletRequest request,
				HttpServletResponse response,
				Object handler,
				Exception ex
		) {
			// Only exceptions thrown by controller actions are rendered here. Others (for example,
			// from static resources) go to Spring Boot's error page.
			if (!(handler instanceof HandlerMethod hm)) {
				return null;
			}

			// Parse stack trace into a string.
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			ex.printStackTrace(pw);
			String stackTraceStr = sw.toString();

			// Return error code 500.
			HttpStatus internalServerErrorCode = HttpStatus.INTERNAL_SERVER_ERROR;

			Map<String, String> model = new HashMap<>();
			model.put("action", hm.getMethod().getName());
			model.put("controller", hm.getBean().getClass().getSimpleName());
			model.put("message", ex.getMessage());
			model.put("trace", stackTraceStr);
			model.put("status", Integer.toString(internalServerErrorCode.value()));
			model.put("error", internalServerErrorCode.getReasonPhrase());
			model.put("path", request.getRequestURI());
			model.put("method", request.getMethod());
			return new ModelAndView("error", model, internalServerErrorCode);
		}
	}

	/**
	 * Adds the request method to the attributes of Spring Boot's error page (templates/error.html
	 * shows it). Thymeleaf 3.1 templates cannot read the request directly.
	 */
	@Component
	private static class ErrorAttributesWithMethod extends DefaultErrorAttributes {

		@Override
		public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
			Map<String, Object> attributes = super.getErrorAttributes(webRequest, options);
			if (webRequest instanceof ServletWebRequest servletWebRequest) {
				attributes.put("method", servletWebRequest.getRequest().getMethod());
			}
			return attributes;
		}
	}

	@ControllerAdvice(annotations = {RestController.class})
	private static class RestApiHandler extends ResponseEntityExceptionHandler {

		@ExceptionHandler(Exception.class)
		public final ResponseEntity<ErrorModel> handlerRestApiException(Exception ex, WebRequest request) {
			ErrorModel model = new ErrorModel();
			model.setMessage(ex.getMessage());

			// Return error code 500.
			HttpStatus internalServerErrorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			model.setError(internalServerErrorCode.getReasonPhrase());
			model.setStatus(internalServerErrorCode.value());

			return new ResponseEntity<>(model, internalServerErrorCode);
		}
	}

}

package com.lacunasoftware.suite.sample;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Component
@ControllerAdvice
public class GlobalExceptionHandler extends AbstractHandlerExceptionResolver {

	@Override
	protected ModelAndView doResolveException(
		HttpServletRequest request,
		HttpServletResponse response,
		Object handler, 
		Exception ex
	) {
		HandlerMethod hm = (HandlerMethod)handler;

		// Parse stack trace into a string.
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		ex.printStackTrace(pw);
		String stackTraceStr = sw.toString();

		Map<String, String> model = new HashMap<>();
		model.put("method", hm.getMethod().getName());
		model.put("controller", hm.getBean().getClass().getSimpleName());
		model.put("errorMessage", ex.getMessage());
		model.put("stackHtml", stackTraceStr
			.replaceAll("\n", "<br>")
			.replaceAll("\t", "&nbsp;&nbsp;&nbsp;"));
		return new ModelAndView("error", model);
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ModelAndView handleError404(HttpServletRequest request, NoHandlerFoundException ex) {
		Map<String, String> model = new HashMap<>();
		model.put("httpMethod", ex.getHttpMethod());
		model.put("requestUrl", ex.getRequestURL());
		model.put("errorMessage", ex.getMessage());
		return new ModelAndView("404", model);
	}

}

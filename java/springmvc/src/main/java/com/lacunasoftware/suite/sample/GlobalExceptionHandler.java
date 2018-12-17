package com.lacunasoftware.suite.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@ControllerAdvice
public class GlobalExceptionHandler extends AbstractHandlerExceptionResolver {

	@Autowired
	private List<HandlerMapping> handlerMappings;

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
		model.put("stackHtml", stackTraceStr);
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

	@ExceptionHandler(Throwable.class)
	public ModelAndView handleUncaughtException(HttpServletRequest request, Exception ex) {

		// Parse stack trace into a string.
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		ex.printStackTrace(pw);
		String stackTraceStr = sw.toString();

		String controller = null;
		String method = null;
		for (HandlerMapping handlerMapping : handlerMappings) {
			try {
				HandlerExecutionChain handlerExecutionChain = handlerMapping.getHandler(request);
				if (handlerExecutionChain != null) {
					HandlerMethod handler = (HandlerMethod) handlerExecutionChain.getHandler();
					controller = handler.getBean().getClass().getSimpleName();
					method = handler.getMethod().getName();
				}
			} catch (Exception e) {
				// do nothing.
			}

		}

		Map<String, String> model = new HashMap<>();
		model.put("method", method);
		model.put("controller", controller);
		model.put("errorMessage", ex.getMessage() != null ? ex.getMessage() : ex.toString());
		model.put("stackHtml", stackTraceStr);
		return new ModelAndView("error", model);
	}

}

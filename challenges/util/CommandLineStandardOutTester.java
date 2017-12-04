import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import java.util.function.Consumer;

import java.util.List;
import java.util.ArrayList;

public class CommandLineStandardOutTester {

	private ByteArrayOutputStream baos;
	private Consumer<String[]> expectedConsumer;
	private Consumer<String[]> actualConsumer;
	private List<TestResult> results;
	private PrintStream ps;
	private PrintStream old;

	public CommandLineStandardOutTester(Consumer<String[]> expectedConsumer,
		Consumer<String[]> actualConsumer) {

		this.expectedConsumer = expectedConsumer;
		this.actualConsumer = actualConsumer;

		results = new ArrayList<TestResult>();

		// Capture stdout
		baos = new ByteArrayOutputStream();
		ps = new PrintStream(baos);
		old = System.out;
		System.setOut(ps);
	}

	public void runTest(String...args) {
		// Call the method to be tested
		expectedConsumer.accept(args);

		// Flush out stream so that all output from stdout is ready
		ps.flush();

		// Get output from stdout
		String actualOut = baos.toString();

		// Clears the output stream
		baos.reset();

		// Call the method that gives expected results
		actualConsumer.accept(args);

		// Flush out stream so that all output from stdout is ready
		ps.flush();

		// Get output from stdout
		String expectedOut = baos.toString();

		// Clears the output stream
		baos.reset();

		TestResult result = new TestResult(expectedOut, actualOut);
		results.add(result);
	}

	public List<TestResult> getResults() {
		return results;
	}

	public String toJsonString() {
		String ret = "[";
		for (int i = 0; i < results.size(); i++) {
			ret += results.get(i).toJsonString();
			if (i != results.size() - 1) {
				ret += ",";
			}
		}

		ret += "]";
		return ret;
	}

	public void endTests() {
		// Set stdout back to sysout
		System.setOut(old);
	}
}
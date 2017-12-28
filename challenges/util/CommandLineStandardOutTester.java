import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import java.util.function.Consumer;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class CommandLineStandardOutTester {

	private ByteArrayOutputStream baos;
	private Consumer<String[]> expectedConsumer;
	private Consumer<String[]> actualConsumer;
	private Consumer<TestResult[]> resultHandler;
	private TestResult[] results;
	private PrintStream ps;
	private PrintStream old;

	public CommandLineStandardOutTester(Consumer<String[]> expectedConsumer,
		Consumer<String[]> actualConsumer) {

		this.expectedConsumer = expectedConsumer;
		this.actualConsumer = actualConsumer;

		// Capture stdout
		baos = new ByteArrayOutputStream();
		ps = new PrintStream(baos);
		old = System.out;
		System.setOut(ps);
	}

	public void runTests(String[][] args) {

		final AtomicInteger numTest = new AtomicInteger();
		results = new TestResult[args.length];

		for (int i = 0; i < args.length; i++) {

			numTest.set(i);
			long startTime = System.currentTimeMillis();
			
			Runnable testRunner = new Runnable() {
				public void run() {
					// Ensure that we are capturing stdout
					System.setOut(ps);

					// Call the method to be tested
					expectedConsumer.accept(args[numTest.get()]);
			
					// Flush out stream so that all output from stdout is ready
					ps.flush();
			
					// Get output from stdout
					String actualOut = baos.toString();
			
					// Clears the output stream
					baos.reset();

					// Ensure that we are capturing stdout
					System.setOut(ps);
			
					// Call the method that gives expected results
					actualConsumer.accept(args[numTest.get()]);
			
					// Flush out stream so that all output from stdout is ready
					ps.flush();
			
					// Get output from stdout
					String expectedOut = baos.toString();
			
					// Clears the output stream
					baos.reset();
			
					TestResult result = new TestResult(expectedOut, actualOut, System.currentTimeMillis() - startTime, false);
					results[numTest.get()] = result;
				}
			};

			Thread t = new Thread(testRunner);
			t.start();
			
			Timer timer = new Timer();
			TimerTask task = new TimerTask() {
				public void run() {
					t.stop();
					System.out.println("Hello");
					TestResult result = new TestResult(System.currentTimeMillis() - startTime, true);
					results[numTest.get()] = result;
				}
			};
			timer.schedule(task, 200);

			try {
				t.join();
				timer.cancel();
				timer.purge();
			} catch(Exception e) {
				e.printStackTrace();
			}
		}

		endTests();
		resultHandler.accept(results);
	}

	public TestResult[] getResults() {
		return results;
	}

	public String toJsonString() {
		String ret = "[";
		for (int i = 0; i < results.length; i++) {
			ret += results[i].toJsonString();
			if (i != results.length - 1) {
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

	public void setResultHandler(Consumer<TestResult[]> resultHandler) {
		this.resultHandler = resultHandler;
	}
}
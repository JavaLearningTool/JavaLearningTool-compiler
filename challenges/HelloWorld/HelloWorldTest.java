import java.util.List;

public class HelloWorldTest {

	public static void main(String[] args) {

		// Make tester for this Challenge
		CommandLineStandardOutTester tester =
			new CommandLineStandardOutTester(Test::main, HelloWorldTest::approved);

		// Run test case
		String[] testArgs = {};
		tester.runTest(testArgs);

		// End the tests. Must be done to set stdout back sysout
		tester.endTests();

		// Print results
		List<TestResult> results = tester.getResults();
		for (TestResult result: results) {
			System.out.println(result.toJsonString());
		}
	}

	public static void approved(String[] args) {
		System.out.println("Hello World");
	}
}
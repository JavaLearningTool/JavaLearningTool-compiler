import java.util.List;

public class HelloWorldTest {

	public static void main(String[] args) {

		// Make tester for this Challenge
		CommandLineStandardOutTester tester =
			new CommandLineStandardOutTester(Test::main, HelloWorldTest::approved);

		// Run test case
		String[] testArgs = {};
		tester.runTest(testArgs);
		tester.runTest(testArgs);

		// End the tests. Must be done to set stdout back sysout
		tester.endTests();

		// Print results
		System.out.println(tester.toJsonString());
	}

	public static void approved(String[] args) {
		System.out.println("Hello World");
	}
}
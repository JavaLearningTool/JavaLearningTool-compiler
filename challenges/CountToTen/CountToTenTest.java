import java.util.List;

public class CountToTenTest {

	public static void main(String[] args) {

		// Make tester for this Challenge
		CommandLineStandardOutTester tester =
			new CommandLineStandardOutTester(Test::main, CountToTenTest::approved);


		// This is called when tests are done
		tester.setResultHandler(results -> {
			// Print results
			System.out.println(tester.toJsonString());
		});

		// Run test case
		String[][] testArgs = {{"1"}, {"5"}, {"10"}};
		tester.runTests(testArgs);
	}

	public static void approved(String[] args) {
        int j = Integer.parseInt(args[0]);
        
        for (int i = 0; i < j; i++) {
            System.out.print(i + 1);
            if (i != j - 1) {
                System.out.print(",");
            }
        }
	}
}
public class TestResult<T> {

	private T expected;
	private T actual;
	private boolean passed;

	public TestResult(T expected, T actual) {
		this.expected = expected;
		this.actual = actual;
		passed = expected.equals(actual);
	}

	public String toJsonString() {
		return String.format("{\"expected\": \"%s\", \"actual\": \"%s\", \"passed\": \"%s\"}",
			expected.toString(), actual.toString(), passed ? "true" : "false");
	}
}
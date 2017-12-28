public class TestResult<T> {

	private T expected;
	private T actual;
	private boolean passed;

	private long time;
	private boolean timeout;

	public TestResult(T expected, T actual, long time, boolean timeout) {
		this.expected = expected;
		this.actual = actual;
		passed = expected.equals(actual);

		this.time = time;
		this.timeout = timeout;
	}

	public TestResult(long time, boolean timeout) {
		this.expected = null;
		this.actual = null;
		passed = false;

		this.time = time;
		this.timeout = timeout;
	}

	public String toJsonString() {
		return String.format("{\"expected\": \"%s\", \"actual\": \"%s\", \"passed\": \"%s\", \"time\": \"%s\", \"timeout\": \"%s\"}",
			expected == null ? "null" : expected.toString(),
			actual == null ? "null" : actual.toString(),
			passed ? "true" : "false",
			time,
			timeout ? "true" : "false");
	}
}
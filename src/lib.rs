use anyhow::Result;
use fastedge::body::Body;
use fastedge::http::{Request, Response, StatusCode};

// The macro exports `main` for the Wasm host; under `cargo test` (host target)
// that clashes with the test harness's entry point, so it applies outside tests.
#[cfg_attr(not(test), fastedge::http)]
#[allow(dead_code)]
fn main(_req: Request<Body>) -> Result<Response<Body>> {
    let greeting = std::env::var("GREETING").unwrap_or_else(|_| "hello".to_string());
    Response::builder()
        .status(StatusCode::OK)
        .header("content-type", "text/plain;charset=UTF-8")
        .body(Body::from(format!("{greeting} (v{})\n", env!("CARGO_PKG_VERSION"))))
        .map_err(Into::into)
}

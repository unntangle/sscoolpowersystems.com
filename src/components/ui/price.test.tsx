import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Price } from "./price";

describe("<Price>", () => {
  it("shows selling price, MRP and a rounded-down discount", () => {
    render(<Price amount={32990} mrp={45990} />);
    expect(screen.getByTestId("price-amount")).toHaveTextContent("₹32,990");
    expect(screen.getByText("₹45,990")).toBeInTheDocument();
    expect(screen.getByTestId("price-off")).toHaveTextContent("28% off");
  });

  it("shows only the MRP for quote-led products", () => {
    render(<Price mrp={45990} />);
    expect(screen.getByText("MRP")).toBeInTheDocument();
    expect(screen.queryByTestId("price-amount")).not.toBeInTheDocument();
    expect(screen.queryByTestId("price-off")).not.toBeInTheDocument();
  });

  it("hides MRP and discount when there is no real saving", () => {
    render(<Price amount={1999} mrp={1999} />);
    expect(screen.queryByTestId("price-off")).not.toBeInTheDocument();
    expect(screen.queryByText("MRP")).not.toBeInTheDocument();
  });

  it("renders nothing without any price", () => {
    const { container } = render(<Price />);
    expect(container).toBeEmptyDOMElement();
  });
});

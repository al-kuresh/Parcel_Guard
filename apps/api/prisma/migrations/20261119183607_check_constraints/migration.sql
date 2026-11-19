-- Rules the database enforces on its own (docs/03-database-design.md §4.4).
-- Prisma's schema language can't express CHECK constraints, so this migration is
-- written by hand. If the app ever tries to save a negative price or a risk score
-- of 140, Postgres rejects the row, even if the code has a bug.

-- Money is never negative. (Differences can be, so payout_lines.difference_paisa has no check.)
ALTER TABLE "products"       ADD CONSTRAINT "products_price_paisa_check"            CHECK ("price_paisa" >= 0);
ALTER TABLE "orders"         ADD CONSTRAINT "orders_subtotal_paisa_check"           CHECK ("subtotal_paisa" >= 0);
ALTER TABLE "orders"         ADD CONSTRAINT "orders_delivery_charge_paisa_check"    CHECK ("delivery_charge_paisa" >= 0);
ALTER TABLE "orders"         ADD CONSTRAINT "orders_cod_amount_paisa_check"         CHECK ("cod_amount_paisa" >= 0);
ALTER TABLE "order_items"    ADD CONSTRAINT "order_items_unit_price_paisa_check"    CHECK ("unit_price_paisa" >= 0);
ALTER TABLE "shipments"      ADD CONSTRAINT "shipments_charge_paisa_check"          CHECK ("charge_paisa" >= 0);
ALTER TABLE "shipments"      ADD CONSTRAINT "shipments_cod_expected_paisa_check"    CHECK ("cod_expected_paisa" >= 0);
ALTER TABLE "payout_batches" ADD CONSTRAINT "payout_batches_total_paid_paisa_check" CHECK ("total_paid_paisa" >= 0);
ALTER TABLE "payout_lines"   ADD CONSTRAINT "payout_lines_amount_paid_paisa_check"  CHECK ("amount_paid_paisa" >= 0);
ALTER TABLE "ai_parse_logs"  ADD CONSTRAINT "ai_parse_logs_cost_micro_usd_check"    CHECK ("cost_micro_usd" >= 0);

-- Counts: you can't sell zero or minus two of something, or have negative stock.
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "products"    ADD CONSTRAINT "products_stock_check"       CHECK ("stock" >= 0);
ALTER TABLE "shops"       ADD CONSTRAINT "shops_order_seq_check"      CHECK ("order_seq" >= 0);

-- Scores are percentages.
ALTER TABLE "orders" ADD CONSTRAINT "orders_risk_score_check"      CHECK ("risk_score" BETWEEN 0 AND 100);
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_quality_check" CHECK ("address_quality" BETWEEN 0 AND 100);

-- CreateTable
CREATE TABLE "task_history" (
    "task_id" INTEGER NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "old_values" JSONB,
    "new_values" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "task_history_task_id_key" ON "task_history"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_history_changed_by_key" ON "task_history"("changed_by");

-- CreateIndex
CREATE INDEX "task_history_task_id_idx" ON "task_history"("task_id");

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

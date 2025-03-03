import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProgressSteps({ step1, step2, step3 }) {
  // Step data
  const steps = [
    { id: 1, label: "Login", completed: step1 },
    { id: 2, label: "Shipping", completed: step2 },
    { id: 3, label: "Summary", completed: step3 },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const handleHover = (stepNumber) => {
    if (!steps[stepNumber - 1].completed) {
      toast.info(`Complete ${steps[stepNumber - 1].label} to continue`, {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center py-8 gap-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            {/* Step Container */}
            <motion.div
              className="flex flex-col items-center gap-2"
              variants={stepVariants}
              onHoverStart={() => handleHover(step.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon Container */}
              <div className="relative h-9 w-9">
                <AnimatePresence>
                  {step.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0"
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="h-full w-full text-green-500" />
                    </motion.div>
                  ) : (
                    <Circle
                      className={`h-full w-full ${
                        step.completed ? "text-green-500" : "text-gray-300"
                      }`}
                      strokeWidth={1.5}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Step Label */}
              <motion.span
                className={`text-sm font-medium ${
                  step.completed ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </motion.span>
            </motion.div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`h-[2px] ${
                  steps[index].completed ? "bg-green-500" : "bg-gray-200"
                }`}
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: 1,
                  width: "4rem",
                  backgroundColor: steps[index].completed
                    ? "#10b981"
                    : "#e5e7eb",
                }}
                transition={{
                  width: { type: "spring", stiffness: 200 },
                  backgroundColor: { duration: 0.3 },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

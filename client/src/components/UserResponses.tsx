import { useEffect } from "react";

const responses = [
  {
    "2024-07-09T04:26:00.000Z": {
      answer:
        "I grew up in a small house with a big backyard. We had an apple tree that my siblings and I used to climb. My room was upstairs, and I shared it with my sister. We had bunk beds, and I always took the top bunk.",
      question: "Can you tell me about your childhood home?",
    },
    "2024-07-09T04:27:00.000Z": {
      answer:
        "I loved history. My teacher, Mr. Thompson, made the past come alive with his stories. I remember learning about ancient Egypt and being fascinated by the pyramids and pharaohs.",
      question: "What was your favorite subject in school?",
    },
    "2024-07-09T04:28:00.000Z": {
      answer:
        "My first job was at a local bakery when I was 16. I started off washing dishes, but soon I was helping to bake bread and pastries. The smell of fresh bread in the morning was the best part of the job.",
      question: "What was your first job, and what did you do?",
    },
    "2024-07-09T04:29:00.000Z": {
      answer:
        "Every Sunday, we had a big family dinner. My grandmother would cook a roast with all the trimmings, and everyone would come over. We would sit around the table for hours, talking and laughing.",
      question: "What family traditions did you have when you were growing up?",
    },
    "2024-07-09T04:30:00.000Z": {
      answer:
        "Christmas was a magical time. We would decorate the tree together and hang stockings by the fireplace. On Christmas morning, we would wake up early to open presents, and then have a big breakfast together.",
      question:
        "How did your family celebrate holidays like Christmas or Thanksgiving?",
    },
    "2024-07-09T04:31:00.000Z": {
      answer:
        "We took a road trip to the Grand Canyon when I was ten. It was the first time I had seen anything so vast and beautiful. We camped nearby and spent our days hiking and exploring.",
      question:
        "Did you travel much when you were younger? Any memorable vacations?",
    },
    "2024-07-09T04:32:00.000Z": {
      answer:
        "My best friend was Jenny. We met in kindergarten and were inseparable. We loved riding our bikes around the neighborhood and playing in the park. She was like a sister to me.",
      question:
        "Who was your best friend growing up, and what did you like to do together?",
    },
    "2024-07-09T04:33:00.000Z": {
      answer:
        "I remember my high school graduation vividly. I was the first in my family to graduate, and my parents were so proud. Walking across that stage to receive my diploma was a moment I'll never forget.",
      question:
        "Do you remember any special events or milestones in your life?",
    },
    "2024-07-09T04:34:00.000Z": {
      answer:
        "I enjoyed painting and would spend hours creating landscapes and portraits. I also loved playing the piano and would practice every day after school.",
      question: "What hobbies did you have when you were younger?",
    },
    "2024-07-09T04:35:00.000Z": {
      answer:
        "My favorite treat was my mom's homemade apple pie. She made the crust from scratch, and it was always perfectly flaky. I loved it warm, with a scoop of vanilla ice cream on top.",
      question: "What was your favorite meal or treat growing up?",
    },
  },
];
const UserResponses = () => {
  return (
    <div>
      <div className="main flex-col">
        <div className="date-selection flex flex-row">
          <div className=""></div>
          <div className=""></div>
        </div>
        <div className="flex flex-col m-8">
          <div>
            <h1 className="text-3xl font-semibold text-center mb-4">
              User Responses
            </h1>
          </div>
          {Object.entries(responses[0]).map(
            ([timestamp, { answer, question }]) => (
              <div
                key={timestamp}
                className="bg-slate-200 flex-col p-4 m-2 rounded-2xl"
              >
                <h2>
                  <span className="font-semibold">Q:</span> {question}
                </h2>
                <p>
                  <span className="font-semibold">A:</span> {answer}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default UserResponses;

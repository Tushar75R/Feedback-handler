import { BackgroundGradient } from "@/components/ui/background-gradient";

const page = () => {
  return (
    <>
      <div className="w-screen relative flex justify-center">
        <div className="w-2/3 border-2 bg-white border-gray-300 shadow-xl shadow-gray-300 rounded-3xl flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold mb-6">Welcome to FeedCast</h1>
          <p className="text-center mb-6 text-lg">
            Streamline your feedback collection with FeedCast. Generate unique
            URLs that allow you to gather feedback from your users, clients, or
            blog visitors. Whether you're a developer, blogger, or business
            owner, FeedCast makes it easy to manage all your feedback in one
            place, helping you speed up the process and stay organized.
          </p>
          <p className="text-center mb-6 text-lg">
            Ready to efficiently manage your feedback and improve your projects?
            Click on the "Join" button in the navbar and start today!
          </p>
        </div>
      </div>
    </>
  );
};

export default page;

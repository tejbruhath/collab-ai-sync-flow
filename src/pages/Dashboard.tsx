
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DocumentList from "@/components/DocumentList";
import CreateDocumentDialog from "@/components/CreateDocumentDialog";

const Dashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Document
        </Button>
      </div>
      
      <DocumentList onDocumentClick={(id) => navigate(`/document/${id}`)} />
      <CreateDocumentDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Dashboard;

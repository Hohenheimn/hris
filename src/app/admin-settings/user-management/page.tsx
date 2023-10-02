"use client";

import React, { useState } from "react";

import Button from "@/components/Button";
import { textDateFormat } from "@/components/helper";
import Modal from "@/components/Modal";
import UserForm from "@/components/page-components/AdminSettings/Users/UserForm";
import PageTitle from "@/components/PageTitle";
import Search from "@/components/Search";
import Tab from "@/components/Tab";
import Table, { TableColumnsType } from "@/components/Table";
import { useFetch } from "@/util/api";

function UserPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isTab, setTab] = useState("users");
  const [modal, setModal] = useState(false);

  const emptyVal = {
    name: "",
    email: "",
  };

  const [defaultValue, setDefaultValue] = useState(emptyVal);

  const columns: TableColumnsType[] = [
    {
      title: "Name",
      cellKey: "name",
      textAlign: "left",
    },
    {
      title: "Email",
      cellKey: "email",
      textAlign: "left",
    },
  ];
  const { data, isLoading } = useFetch(
    "users-list",
    ["users-list", search, page],
    `/api/users?search=${search}&page=${page}`
  );

  const { data: archive, isLoading: archiveLoading } = useFetch(
    "users-list-archive",
    ["users-list-archive", search, page],
    `/api/users/archive?search=${search}&page=${page}`
  );
  return (
    <>
      <PageTitle title={["Admin Settings", "User Management"]} />
      <Tab tab={isTab} setTab={setTab} tabMenu={["users", "archive"]} />
      <div className=" flex items-center flex-wrap gap-3 justify-between">
        <Search search={search} setSearch={setSearch} />
        <Button
          appearance={"primary"}
          onClick={() => {
            setDefaultValue(emptyVal);
            setModal(true);
          }}
        >
          Add
        </Button>
      </div>
      <Table
        isLoading={isTab === "users" ? isLoading : archiveLoading}
        columns={columns}
        data={
          isTab === "users" ? data?.data?.data?.data : archive?.data?.data?.data
        }
        onClickRow={(data) => {
          if (isTab === "users") {
            setDefaultValue(data);
            setModal(true);
          }
        }}
        setPage={setPage}
        page={page}
        totalPage={
          isTab === "users"
            ? data?.data?.data?.last_page
            : archive?.data?.data?.last_page
        }
      />
      <Modal
        show={modal}
        onClose={() => {
          setModal(false);
        }}
        width="narrow"
      >
        <UserForm setModal={setModal} defaultValues={defaultValue} />
      </Modal>
    </>
  );
}

export default UserPage;
